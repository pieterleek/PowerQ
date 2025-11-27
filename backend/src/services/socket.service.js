/* * MI6 SATELLITE UPLINK
 * MODULE: SOCKET SERVICE
 * SECURITY: VIEWER ONLY
 */

let io = null;

exports.setupSocket = (socketIoInstance) => {
    io = socketIoInstance;

    // SOCKET BEWAKING (Middleware)
    io.use((socket, next) => {
        const token = socket.handshake.auth.token; 
        
        // We halen nu de VIEWER sleutel op, want alleen de frontend gebruikt Sockets
        const viewerKey = process.env.VIEWER_SECRET; 

        // HIER GING HET FOUT: We vergelijken nu met 'viewerKey'
        if (token === viewerKey) {
            // Toegang verleend
            next();
        } else {
            // Toegang geweigerd
            console.warn(`SOCKET BLOCKED: Invalid Viewer Token from ${socket.id}`);
            const err = new Error("UNAUTHORIZED");
            err.data = { content: "Alleen voor bevoegde ogen." };
            next(err);
        }
    });

    io.on('connection', (socket) => {
        console.log(`Viewer connected via Secure Socket: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(` Viewer disconnected: ${socket.id}`);
        });
    });
};

exports.getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};