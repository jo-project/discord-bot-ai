declare global {
    namespace NodeJS {
      interface ProcessEnv {
        TOKEN: string;
        API: string,
        COOKIE: string,
        EMAIL: string,
        PASSWORD: string,
        OPEN_AI_ORG: string,
        OPEN_AI_KEY: string,
        BACKUP_URI: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
export {}