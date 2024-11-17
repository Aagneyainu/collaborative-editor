// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');


const documentRoutes = require('./routes/documents');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);



    socket.on('joinDocument', (documentId) => {
        socket.join(documentId);
        console.log(`Socket ${socket.id} joined document ${documentId}`);
    });

    socket.on('sendMessage', (data) => {
        const { documentId, message, user } = data;
        io.to(documentId).emit('receiveMessage', { message, user, timestamp: new Date() });
      });

    socket.on('editDocument', async (data) => {

        const { documentId, content, userId } = data;

        // Fetch current document
        const document = await Document.findByPk(documentId);
        if (!document) return;

        // Simple conflict resolution: overwrite with latest edit
        document.content = content;
        document.version += 1;
        await document.save();

        // Broadcast the updated content and version
        io.to(documentId).emit('receiveEdit', {
            content: document.content,
            version: document.version,
            userId,
        });
        // Broadcast changes to other clients in the same room
        // socket.to(data.documentId).emit('receiveEdit', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/api/documents', documentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
