let io = null;

exports.setupSocket = (socketIoInstance) => {
    io = socketIoInstance;

    // SOCKET BEWAKING (Middleware)
    // Elke keer als iemand probeert te verbinden, checken we zijn papieren.
    io.use((socket, next) => {
        const token = socket.handshake.auth.token; // Hier verwachten we de sleutel
        const secretKey = process.env.API_SECRET_KEY; // De sleutel uit .env

        if (token === secretKey) {
            // Toegang verleend
            next();
        } else {
            // Toegang geweigerd
            const err = new Error("UNAUTHORIZED");
            err.data = { content: "Probeer het niet nog eens." };
            next(err);
        }
    });

    io.on('connection', (socket) => {
        console.log(`🕵️  Agent connected via Secure Socket: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(`Agent disconnected: ${socket.id}`);
        });
    });
};

exports.getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};