const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const messages = {
    cs2: [
        { username: 'System', content: 'Available CS2 Cracks: MIDNIGHT, COMPKILLER, PLAGUECHEAT', timestamp: new Date().toISOString(), pinned: true }
    ],
    csgo: [
        { username: 'System', content: 'Available CS:GO Cracks: FATALITY, GAMESENSE, NIXWARE, HAVOC, PRIMORDIAL, REVERSIVE', timestamp: new Date().toISOString(), pinned: true }
    ]
};

wss.on('connection', (ws) => {
    console.log('New client connected, asshole.');
    ws.send(JSON.stringify({ type: 'init', messages }));

    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.type === 'chat') {
            const message = {
                username: msg.username,
                content: msg.content,
                timestamp: new Date().toISOString(),
                pinned: false
            };
            messages[msg.tab].push(message);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'chat', tab: msg.tab, message }));
                }
            });
        }
    });

    ws.on('close', () => console.log('Client disconnected, fuck off.'));
});

console.log('WebSocket server running on ws://localhost:8080, you prick.');