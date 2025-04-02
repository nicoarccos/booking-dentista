import CheckAppointments from "./components/CheckAppointment";
//import AddAppointment from "./components/AddAppointments";
import DeleteAppointment from "./components/DeleteAppointment";
import FullCalendarComponent from "./components/FullCalendarComponent";
import UpdateAppointment from "./components/UpdateAppointment";
import Layout from "./components/Layout";
import MyImage from "./components/ExampleImg";
import NVPAlert from "./components/NVPAlert";
import Hero from './components/Hero'

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-dental-dark sm:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mt-4 text-lg text-dental-gray-600">
              Ofrecemos una amplia gama de servicios dentales para cuidar tu salud bucal
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Limpieza Dental',
                description: 'Mantenimiento profesional para una sonrisa saludable',
                icon: '🦷'
              },
              {
                title: 'Blanqueamiento',
                description: 'Recupera el brillo natural de tu sonrisa',
                icon: '✨'
              },
              {
                title: 'Ortodoncia',
                description: 'Corrección y alineación dental profesional',
                icon: '🦷'
              },
              {
                title: 'Implantes',
                description: 'Soluciones permanentes para dientes perdidos',
                icon: '🦷'
              },
              {
                title: 'Endodoncia',
                description: 'Tratamiento de conductos y cuidado de la pulpa dental',
                icon: '🦷'
              },
              {
                title: 'Odontopediatría',
                description: 'Cuidado dental especializado para niños',
                icon: '🦷'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="relative p-6 bg-dental-light rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-dental-dark">{service.title}</h3>
                <p className="mt-2 text-dental-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
