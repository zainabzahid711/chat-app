import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message  # Import your Message model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        username = text_data_json.get('user', 'Anonymous')

        # Save message to database
        message = await self.save_message(message_content, username)

        # Send full message data to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'user': message.user,
                    'content': message.content,
                    'timestamp': message.timestamp.isoformat(),
                    'room': message.room.id
                }
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message_data = event['message']

        # Send full message data to WebSocket
        await self.send(text_data=json.dumps(message_data))

    @sync_to_async
    def save_message(self, content, username):
        from .models import Room, Message
        # Get or create room
        room, created = Room.objects.get_or_create(id=int(self.room_name))
        # Create message
        message = Message.objects.create(
            room=room,
            user=username,
            content=content
        )
        return message