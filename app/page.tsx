import CheckAppointments from "./components/CheckAppointment";
//import AddAppointment from "./components/AddAppointments";
import DeleteAppointment from "./components/DeleteAppointment";
import FullCalendarComponent from "./components/FullCalendarComponent";
import UpdateAppointment from "./components/UpdateAppointment";
import Layout from "./components/Layout";
export default function Home() {
  

  return <> 
  <Layout>
  <h1>Please select a date to start booking an appointment</h1>
  <CheckAppointments/>
  <FullCalendarComponent/>
  <UpdateAppointment/>
  <DeleteAppointment/>
  </Layout>
  
  
  </>
  ;
}
