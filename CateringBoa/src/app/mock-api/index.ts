import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { CateringMockApi } from './catering/solicitud/api';
import { CargaMockApi} from './catering/carga/api';
import { AeronaveMockApi} from './catering/aeronave/api';
import { FlotaMockApi } from './catering/flota/api';

export const mockApiServices = [
    AuthMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    UserMockApi,
    CateringMockApi,
    CargaMockApi,
    AeronaveMockApi,
    FlotaMockApi
];
