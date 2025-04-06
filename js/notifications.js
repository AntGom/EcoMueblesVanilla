const showNotification = (message, type = "info", duration = 3000) => {
  // Verificar si hay notificación visible
  const existingNotifications = document.querySelectorAll(".notification");
  const offset = existingNotifications.length * 60; // Espacio entre notificaciones

  // Crear notificación
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.style.bottom = `${20 + offset}px`;

  // Contenido de la notificación
  notification.innerHTML = `
      <div class="notification__content">
        <p>${message}</p>
        <button class="notification__close">&times;</button>
      </div>
    `;

  // Añadir al cuerpo del documento
  document.body.appendChild(notification);

  // Notificación con animación
  notification.style.opacity = "1";
  notification.style.transform = "translateY(0)";

  // Cierre
  const closeButton = notification.querySelector(".notification__close");
  const closeNotification = () => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  };

  closeButton.addEventListener("click", closeNotification);

  // Auto-cierre
  if (duration > 0) {
    setTimeout(closeNotification, duration);
  }
};

// Estilos para notificaciones
const addNotificationStyles = () => {
  if (document.getElementById("notification-styles")) return;

  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
      .notification {
        position: fixed;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 9999;
        min-width: 250px;
        max-width: 350px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .notification--success {
        background-color: #4CAF50;
      }
      
      .notification--error {
        background-color: #f44336;
      }
      
      .notification--info {
        background-color: #2196F3;
      }
      
      .notification__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      
      .notification__close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
      }
      
      .notification p {
        margin: 0;
        flex-grow: 1;
      }
    `;

  document.head.appendChild(style);
};

addNotificationStyles();

export { showNotification };
