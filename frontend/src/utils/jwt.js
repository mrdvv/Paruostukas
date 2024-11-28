const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]; // Extract the payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace Base64URL characters
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload); // Parse JSON payload
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };
export default decodeJWT;