import { Metadata } from 'next';
import { CareerGuruChat } from '@/components/chatbot/career-guru-chat';

export const metadata: Metadata = {
  title: 'CareerGuru - Your AI Career Advisor',
  description: 'Chat with CareerGuru, your intelligent AI career advisor and best friend for all career-related guidance.',
};

export default function CareerGuruPage() {
  return (
    <div className="flex-1 h-full">
      <CareerGuruChat />
    </div>
  );
}