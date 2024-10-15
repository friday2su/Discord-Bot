function checkCooldown(lastTime, cooldownInSeconds) {
    const now = Date.now();
    if (lastTime && (now - lastTime) < cooldownInSeconds * 1000) {
      const timeLeftInSeconds = cooldownInSeconds - Math.floor((now - lastTime) / 1000);
      const hours = Math.floor(timeLeftInSeconds / 3600);
      const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
      const seconds = timeLeftInSeconds % 60;
      return { remaining: true, time: `${hours}h ${minutes}m ${seconds}s` };
    }
    return { remaining: false };
  }
  
  module.exports = checkCooldown;
  