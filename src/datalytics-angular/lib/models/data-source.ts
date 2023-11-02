

export class DataSource {
  name: string;
  description: string;
  category: DATA_SOURCE_TYPE;
  api: ApiDetails = new ApiDetails();
  db: DBConnectionDetails = new DBConnectionDetails();
  file: FileDetails = new FileDetails();
  _id: string;
}


export class DBConnectionDetails {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  sub_category: DB_TYPE
}

export class ApiDetails {
  method: API_METHOD_TYPE;
  url: string;
  datatype: DATA_TYPE;
  authorization: string;
  body: string;
  username: string;
  password: string;
  token: string;
  sub_category: string;
}
export class FileDetails {
  type: string;
  upload: any = {};
  interal: any = {};
  external: FileExternal = new FileExternal()
}

export class FileExternal {
  method: string;
  ip_address: string;
  port: number;
  auth: boolean;
  username: string;
  password: string
}



export type DB_TYPE = 'postgres' | 'mysql' | 'postgress' | 'mariadb' | 'oracle' | 'microsoft_sql';
export type DATA_SOURCE_TYPE = 'api' | 'db' | 'file';
export type API_METHOD_TYPE = 'get' | 'post';
export type DATA_TYPE = 'json' | 'html';
