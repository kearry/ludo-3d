// /app/lib/jwt.ts
const jwt = require('jsonwebtoken');

export const generateJwtToken = async (user: any): Promise<string> => {
  // Use optional chaining to safely access nested properties 
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  try {
    // Create a JWT token with the user's information
    const token = jwt.sign(
      {
        sub: user.id, // subject (user ID)
        name: user.name,
        email: user.email,
        // Add any other relevant claims here
      },
      secretKey,
      {
        expiresIn: '1h', // token expires in 1 hour
      }
    );

    return token;
  } catch (error) {
    // Handle other potential errors here
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate JWT token");
  }
};
