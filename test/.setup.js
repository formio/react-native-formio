
import { Response, Headers, Request } from 'node-fetch';

global.Response = Response;
global.Headers = Headers;
global.Request = Request;
