
export interface Message {
  id: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: number;
  user: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
  messages: Message[];
}

export const mockChats: Chat[] = [
  {
    id: 1,
    user: 'María González',
    initials: 'MG',
    lastMessage: '¿Sigue disponible la lámpara vintage?',
    time: '10:30 AM',
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        text: 'Hola! Vi tu lámpara vintage en la app',
        timestamp: '10:25 AM',
        isOwn: false,
        status: 'read'
      },
      {
        id: 2,
        text: '¿Sigue disponible la lámpara vintage?',
        timestamp: '10:30 AM',
        isOwn: false,
        status: 'delivered'
      },
      {
        id: 3,
        text: 'Hola María! Sí, aún está disponible.',
        timestamp: '10:35 AM',
        isOwn: true,
        status: 'read'
      },
      {
        id: 4,
        text: '¿Te interesa verla en persona?',
        timestamp: '10:35 AM',
        isOwn: true,
        status: 'sent'
      }
    ]
  },
  {
    id: 2,
    user: 'Carlos Ruiz',
    initials: 'CR',
    lastMessage: 'Perfecto, nos vemos mañana para la entrega',
    time: 'Ayer',
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: 'Hola! ¿Podríamos coordinar la entrega de la mesa?',
        timestamp: 'Ayer 2:00 PM',
        isOwn: false,
        status: 'read'
      },
      {
        id: 2,
        text: 'Claro! ¿Te parece bien mañana en la tarde?',
        timestamp: 'Ayer 2:15 PM',
        isOwn: true,
        status: 'read'
      },
      {
        id: 3,
        text: 'Perfecto, nos vemos mañana para la entrega',
        timestamp: 'Ayer 2:20 PM',
        isOwn: false,
        status: 'read'
      }
    ]
  },
  {
    id: 3,
    user: 'Ana Torres',
    initials: 'AT',
    lastMessage: 'Muchas gracias por la información',
    time: '2 días',
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        text: 'Hola! Me gustó mucho tu sofá, ¿podrías darme más detalles?',
        timestamp: '2 días 11:00 AM',
        isOwn: false,
        status: 'read'
      },
      {
        id: 2,
        text: 'Hola Ana! Es un sofá de 3 plazas, muy cómodo y en excelente estado.',
        timestamp: '2 días 11:30 AM',
        isOwn: true,
        status: 'read'
      },
      {
        id: 3,
        text: 'Tiene algunas marcas menores de uso pero nada grave.',
        timestamp: '2 días 11:31 AM',
        isOwn: true,
        status: 'read'
      },
      {
        id: 4,
        text: 'Muchas gracias por la información',
        timestamp: '2 días 12:00 PM',
        isOwn: false,
        status: 'read'
      }
    ]
  }
];
