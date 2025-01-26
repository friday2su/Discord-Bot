module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Define statuses directly here
    const statuses = [
      'Chơi Với Mã!',
      'Serving Người Dùng!',
      'Nghe commands!',
      'Có tí niềm vui với discord!'
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
