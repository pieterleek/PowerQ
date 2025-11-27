let io = null;

exports.setupSocket = (socketIoInstance) => {
    io = socketIoInstance;
};

exports.getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};