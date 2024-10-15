module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Define statuses directly here
    const statuses = [
      'Playing with the code!',
      'Serving users!',
      'Listening to commands!',
      'Having fun with Discord!'
    ];
    
    let i = 0;
    setInterval(() => {
      // Rotate statuses
      const status = statuses[i];
      client.user.setActivity(status, { type: 'PLAYING' });
      i = ++i % statuses.length; // Cycle through statuses
    }, 10000); // Change every 10 seconds
  }
};
