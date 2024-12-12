declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
    }
  }
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

export {}; 