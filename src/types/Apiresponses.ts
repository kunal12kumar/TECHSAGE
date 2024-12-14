export interface AuthApiResponse {
    success: boolean;         // Indicates success or failure
    message: string;          // Description of the response
    token?: string;           // Optional: Authentication token if login is successful
    user?: {
      id: string;
      name: string;
      email: string;
    };                        // Optional: User details
    error?: string;           // Optional: Error message if authentication fails
  }

//   in this we define how our api responses should look like
