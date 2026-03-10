export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho';
  assignedTo: string;
  // prioridad en español con número al inicio (1 = más alta)
  // usamos guion para separar num y texto
  priority: '1 - Urgente' | '2 - Alta' | '3 - Media' | '4 - Baja';
  createdDate: Date;
  deadline?: Date;
  creator: string;
  comments: Comment[];
  history: HistoryEntry[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: Date;
}

export interface HistoryEntry {
  id: string;
  user: string;
  action: string;
  date: Date;
}