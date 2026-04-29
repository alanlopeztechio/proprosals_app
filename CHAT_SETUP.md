# Chat Sidebar Setup

El componente `ChatSidebar` ha sido creado y está listo para usar en tu aplicación.

## Archivos Creados

- **`components/ChatSidebar.tsx`** - Componente de chat para usar como sidebar
- **`app/api/chat/route.ts`** - Endpoint API que maneja los mensajes del chat
- **`.env.example`** - Archivo de ejemplo con las variables de entorno necesarias

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con tu API key de Anthropic:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Puedes obtener tu API key en: https://console.anthropic.com/

### 2. Integración en tu Layout o Página

Para usar el componente `ChatSidebar`, simplemente impórtalo e intégralo en tu layout o página:

**Ejemplo de uso en un layout con dos columnas:**

```tsx
import ChatSidebar from '@/components/ChatSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Chat sidebar */}
      <div className="w-96 border-l">
        <ChatSidebar />
      </div>
    </div>
  );
}
```

**Ejemplo de uso en una página individual:**

```tsx
import ChatSidebar from '@/components/ChatSidebar';

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="flex-1">{/* Your content */}</div>
      <div className="w-96">
        <ChatSidebar />
      </div>
    </div>
  );
}
```

## Características del Componente

- ✅ Interfaz de chat limpia y moderna
- ✅ Diferenciación entre mensajes del usuario (derecha) y del asistente (izquierda)
- ✅ Indicador de carga mientras se procesa la respuesta
- ✅ Input deshabilitado durante el envío de mensajes
- ✅ Estilos con Tailwind CSS que se adaptan al tema de tu aplicación
- ✅ Scroll automático en el contenedor de mensajes

## Personalización

Puedes personalizar el componente modificando:

- **Estilos**: Cambia las clases de Tailwind en [ChatSidebar.tsx](components/ChatSidebar.tsx)
- **Ancho**: Ajusta `w-96` en tu layout al ancho deseado
- **Sistema**: Modifica el mensaje del sistema en [app/api/chat/route.ts](app/api/chat/route.ts#L12)
- **Modelo**: Cambia el modelo en [app/api/chat/route.ts](app/api/chat/route.ts#L8) (por ejemplo, a `claude-3-opus-20250219`)

## Modelos Disponibles

Algunos modelos disponibles en Anthropic:

- `claude-3-5-sonnet-20241022` (recomendado - mejor equilibrio de velocidad y calidad)
- `claude-3-opus-20250219` (más poderoso, más lento)
- `claude-3-haiku-20250307` (más rápido, menos capaz)

## Troubleshooting

### Error: "API key not found"

Asegúrate de que `ANTHROPIC_API_KEY` está configurado en `.env.local` y que el servidor está reiniciado.

### Error: "Failed to generate response"

- Verifica que tu API key es válida
- Comprueba que tienes suficiente crédito en tu cuenta de Anthropic
- Revisa los logs del servidor para más detalles

## Próximas Mejoras

Consideraciones para futuras mejoras:

- [ ] Guardar historial de chat en la base de datos
- [ ] Agregar autenticación de usuario
- [ ] Soportar múltiples conversaciones
- [ ] Agregar streaming de respuestas
- [ ] Integrar contexto de la propuesta actual
