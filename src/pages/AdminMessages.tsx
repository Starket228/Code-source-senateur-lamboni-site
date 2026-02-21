
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, MessageSquare, Mail, Phone, User, Calendar, Trash2, Eye, Reply } from 'lucide-react';
import { CrudService } from '@/utils/crudUtils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const result = await CrudService.read('contact_messages');
      if (result.success && result.data) {
        setMessages(result.data.sort((a: ContactMessage, b: ContactMessage) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const result = await CrudService.update('contact_messages', messageId, { is_read: true });
      if (result.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const result = await CrudService.delete('contact_messages', messageId);
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        toast({
          title: "Message supprimé",
          description: "Le message a été supprimé avec succès."
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message.",
        variant: "destructive"
      });
    }
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Messages de Contact
              </h1>
              <p className="text-gray-600">
                {messages.length} message{messages.length !== 1 ? 's' : ''} 
                {unreadCount > 0 && ` • ${unreadCount} non lu${unreadCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun message</h3>
              <p className="text-gray-500">Vous n'avez reçu aucun message de contact pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  !message.is_read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{message.name}</CardTitle>
                          {!message.is_read && (
                            <Badge variant="destructive" className="text-xs">Nouveau</Badge>
                          )}
                        </div>
                        <CardDescription className="text-base font-medium text-gray-700 mb-2">
                          {message.subject}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-2">
                              <a href={`tel:${message.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline" title="Appeler">
                                <Phone className="w-4 h-4" />
                                {message.phone}
                              </a>
                              <a
                                href={`https://wa.me/${message.phone.replace(/[^0-9+]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                                title="WhatsApp"
                              >
                                WhatsApp
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDistanceToNow(new Date(message.created_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!message.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(message.id)}
                          className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Marquer lu
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const subject = encodeURIComponent(`Re: ${message.subject}`);
                          const body = encodeURIComponent(`\n\n--- Message original ---\nDe: ${message.name}\nSujet: ${message.subject}\n\n${message.message}`);
                          window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, '_blank');
                        }}
                        className="bg-green-50 hover:bg-green-100 border-green-200"
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Répondre
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
