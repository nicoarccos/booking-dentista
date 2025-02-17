import { supabase } from '@/app/utils/supabaseClient';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/sendEmail';

//get all the slots





export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the request URL
    const selectedDate = url.searchParams.get('date'); // Extract the 'date' query parameter

    if (!selectedDate) {
      return NextResponse.json(
        { success: false, message: 'Date query parameter is required.' },
        { status: 400 }
      );
    }

    // Fetch available appointment slots for the specific date
    const { data, error } = await supabase
      .from('appointments_schedule') // Assuming the table is 'appointments_schedule'
      .select('*') // Replace '*' with only the necessary fields if needed
      .eq('date', selectedDate) // Filter by the selected date
      .or('is_booked.eq.false,is_booked.is.null'); // Include slots where booked is false or null

    if (error) {
      console.error('Error fetching appointment schedules:', error.message);
      return NextResponse.json(
        { success: false, message: 'Error fetching schedules', error: error.message },
        { status: 400 }
      );
    }

    // Log the available slots data to the server console
    console.log('Available Slots:', data);

    // Return the fetched data in the response
    return NextResponse.json({ success: true, schedules: data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching schedules:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred', error: err },
      { status: 500 }
    );
  }
}



//post-book an appointment



export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const { schedule_id, customer_email, customer_name, notes, service } = body;

    // Validate the incoming data
    if (!schedule_id || !customer_email || !customer_name || !service) {
      return NextResponse.json(
        { success: false, message: 'Schedule ID, customer email, name, and service are required fields.' },
        { status: 400 }
      );
    }

    // Insert the appointment into the database
    const { data: insertedAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert([{ 
        schedule_id, 
        customer_email, 
        customer_name, 
        notes, 
        service, 
        booked: true // Set booked to true
      }])
      .select(); // Use `.select()` to retrieve the inserted row

    if (insertError) {
      console.error('Error inserting appointment:', insertError.message);
      return NextResponse.json(
        { success: false, message: 'Failed to add appointment.', error: insertError.message },
        { status: 500 }
      );
    }

    const appointment = insertedAppointment[0]; // Get the first (and only) inserted appointment

    // Fetch the corresponding schedule details from the `appointments_schedule` table using `schedule_id`
    const { data: scheduleDetails, error: scheduleError } = await supabase
      .from('appointments_schedule') // Adjusted to the correct table name
      .select('*') // Select the columns you need (date, time, time_slot)
      .eq('id', schedule_id); // Match the schedule ID

    if (scheduleError) {
      console.error('Error fetching schedule details:', scheduleError.message);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch schedule details.', error: scheduleError.message },
        { status: 500 }
      );
    }

    const schedule = scheduleDetails[0]; // Assume there's one schedule row with the given ID

    // Construct the email content
    const emailSubject = 'Appointment Confirmation';
    const emailBody = `
      <h1>Appointment Confirmation</h1>
      <p>Dear ${customer_name},</p>
      <p>Thank you for booking an appointment. Here are your appointment details:</p>
      <ul>
        <li><strong>Appointment ID:</strong> ${appointment.id}</li>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
        <li><strong>Schedule Date:</strong> ${schedule ? schedule.date : 'N/A'}</li>
        <li><strong>Schedule Time:</strong> ${schedule ? schedule.time : 'N/A'}</li>
        <li><strong>Time Slot:</strong> ${schedule ? schedule.time_slot : 'N/A'}</li>
      </ul>
      <p>We look forward to serving you!</p>
      <p>Best regards,</p>
      <p>Your Company Name</p>
    `;

    // Send the email
    const emailResult = await sendEmail({
      to: customer_email,
      subject: emailSubject,
      text: emailBody.replace(/<[^>]+>/g, ''), // Plain text version (strip HTML tags)
      html: emailBody,
    });

    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Appointment added, but email failed.', error: emailResult.error },
        { status: 500 }
      );
    }

    // Respond with success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Appointment added and confirmation email sent.', 
        appointment: insertedAppointment[0] 
      }, 
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred.', error: err },
      { status: 500 }
    );
  }
}



//Delete appointment request



// Define types for the data you're dealing with (adjust the fields if necessary)


export async function DELETE(request: Request) {
  try {
    // Extract the ID and customer_email from the query string
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    const customerEmail = searchParams.get('customer_email');

    // Validate the required parameters
    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID and Customer Email are required.' },
        { status: 400 }
      );
    }

    // Delete the row from the database where both the ID and customer_email match
    const { data, error, count } = await supabase
      .from('appointments') // Adjust the table name if needed
      .delete()
      .eq('id', appointmentId)
      .eq('customer_email', customerEmail)
      .select('*', { count: 'exact' }); // Include a count of affected rows

    if (error) {
      console.error('Error deleting appointment:', error.message);
      return NextResponse.json(
        { success: false, message: 'Error deleting appointment.', error: error.message },
        { status: 400 }
      );
    }

    // Check if any rows were deleted based on the count
    if (count === 0) {
      return NextResponse.json(
        { success: false, message: 'No appointment found with the provided ID and email.' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Appointment deleted successfully.', deletedAppointment: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error deleting appointment:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred.', error: err },
      { status: 500 }
    );
  }
}



//updating appointment 

export async function PATCH(request: Request) {
  try {
    // Extract the ID and customer_email from the query string
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    const customerEmail = searchParams.get('customer_email');

    // Validate the required parameters
    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID and Customer Email are required.' },
        { status: 400 }
      );
    }

    // Explicitly set booked to false
    const booked = false;

    // Update the 'booked' field for the specific appointment row
    const { data, error, count } = await supabase
      .from('appointments') // Adjust the table name if needed
      .update({ booked }) // Set 'booked' field to false
      .eq('id', appointmentId) // Match appointment ID
      .eq('customer_email', customerEmail) // Match customer email
      .select('*', { count: 'exact' }); // Include a count of affected rows

    if (error) {
      console.error('Error updating appointment:', error.message);
      return NextResponse.json(
        { success: false, message: 'Error updating appointment.', error: error.message },
        { status: 400 }
      );
    }

    // Check if any rows were updated based on the count
    if (count === 0) {
      return NextResponse.json(
        { success: false, message: 'No appointment found with the provided ID and email.' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Appointment updated successfully.', updatedAppointment: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error updating appointment:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred.', error: err },
      { status: 500 }
    );
  }
}

