# Booking Dentista

Sistema de reservas para clínica dental.

## Configuración del Proyecto

1. Clona el repositorio:
```bash
git clone https://github.com/nicoarccos/booking-dentista.git
cd booking-dentista
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Copia el contenido de `.env.example`
   - Reemplaza los valores con tus credenciales:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://syinjziavwuilkopmlha.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aW5qemlhdnd1aWxrb3BtbGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NzQ2NDgsImV4cCI6MjA0OTM1MDY0OH0.GfnenUYRyztokw8m742StO5aMxQw7DpUO5k_x55mQtw

# Email Configuration
EMAIL_USER=joakkochatgpt@gmail.com
EMAIL_PASSWORD=yfyw slhl ddye hqmx

# JWT Configuration
JWT_SECRET=your_super_secret_key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Conecta tu repositorio de GitHub
3. En la configuración del proyecto en Vercel, agrega las variables de entorno mencionadas arriba
4. ¡Listo! Tu aplicación estará desplegada y funcionando

## Características

- Reserva de citas dentales
- Selección de fecha y hora
- Confirmación por email
- Panel de administración
- Gestión de horarios disponibles

## Tecnologías Utilizadas

- Next.js 13
- React
- Tailwind CSS
- Supabase
- TypeScript
- Node.js
