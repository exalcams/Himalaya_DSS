import { Guid } from 'guid-typescript';

export class UserWithRole {
    UserID: number;
    RoleID: number;
    UserName: string;
    UserType: string;
    Email: string;
    ContactNumber: string;
    // Plant: string;
    // DocumentType: string;
    // Priority: string;
    DisplayTitle: string;
    ReportingTo: string;
    Plant_ID_List: string[];
    DocumentType_ID_List: string[];
    Password: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class UserPlantDocumentType {
    ID: number;
    UserName: string;
    Plant: string;
    DocumentType: string;
    Priority: string;
    // DisplayTitle: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RoleWithApp {
    RoleID: number;
    RoleName: string;
    AppIDList: number[];
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class MenuApp {
    AppID: number;
    AppName: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class DocumentTypes {
    ID: number;
    Doc_Type_ID: string;
    Doc_Type_Name: string;
    SignatoryType: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class DocumentOutputType {
    ID: number;
    Doc_Type_ID: string;
    Doc_Type_Name: string;
    SignatoryType: string;
    OutputType_ID_List: string[];
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class DocumentTypeView {
    Doc_Type_ID: string;
    Doc_Type_Name: string;
}
export class DocumentOutputTypeMapView {
    DocumentType_ID: string;
    OutputType_ID: string;
}
export class Plant {
    ID: number;
    Plant_ID: string;
    Plant_Name: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class PlantView {
    Plant_ID: string;
    Plant_Name: string;
}
export class UserPlantMapView {
    UserName: string;
    Plant_ID: string;
}
export class Priority {
    ID: number;
    Priority_ID: string;
    Priority_Name: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class PriorityView {
    Priority_ID: string;
    Priority_Name: string;
}
export class OutputType {
    ID: number;
    OutputType_ID: string;
    OutputType_Name: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class OutputTypeView {
    OutputType_ID: string;
    OutputType_Name: string;
}
export class AuthenticationDetails {
    isAuth: boolean;
    userID: number;
    userName: string;
    displayName: string;
    loginTime: string;
    userType: string;
    emailAddress: string;
    userRole: string;
    plant: string;
    menuItemNames: string;
    // profile: string;
    isConfigurationDialog: string;
    isChangePasswordRequired: string;
    refreahToken: string;
    expires: string;
    issued: string;
    expiresin: string;
}
export class UserLoginHistory {
    ID: number;
    UserID: number;
    UserName: string;
    LoginTime: Date;
    LogoutTime?: Date;
}
export class LoginHistoryFilter {
    FromDate: string;
    ToDate: string;
    UserName: string;
}
export class ChangePassword {
    UserID: number;
    UserName: string;
    CurrentPassword: string;
    NewPassword: string;
}
export class EMailModel {
    UserName: string;
    // EmailAddress: string;
    siteURL: string;
}
export class ForgotPassword {
    UserID: number;
    EmailAddress: string;
    NewPassword: string;
    Token: string;
}
export class UserNotification {
    ID: number;
    UserID: string;
    Message: string;
    HasSeen: boolean;
    CreatedOn: Date;
    ModifiedOn?: Date;
}

export class UserAudit {
    UserID: number;
    UserName: string;
    Plant_ID: string;
    Plant_Name: string;
    Email: string;
    ContactNumber: string;
    LoginTime?: Date;
    LogoutTime?: Date;
}



