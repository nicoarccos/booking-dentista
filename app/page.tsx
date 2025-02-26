import CheckAppointments from "./components/CheckAppointment";
//import AddAppointment from "./components/AddAppointments";
import DeleteAppointment from "./components/DeleteAppointment";
import FullCalendarComponent from "./components/FullCalendarComponent";
import UpdateAppointment from "./components/UpdateAppointment";
export default function Home() {
  

  return <> 
  <h1>Supabase Connection Test</h1>
  <CheckAppointments/>
  <FullCalendarComponent/>
  <UpdateAppointment/>
  <DeleteAppointment/>
  
  
  </>
  ;
}
