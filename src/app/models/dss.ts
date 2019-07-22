export class DSSInvoice {
     ID: number;
     Plant_ID: string;
     DocumentType_ID: string;
     OutputType_ID: string;
     INV_NAME: string;
     INVOICE_NAME: string;
     SIGNED_AUTHORITY: string;
     SIGNED_ON: Date;
     AUTOSIGNED: boolean;
}
export class DSSErrorInvoice {
     ID: number;
     INV_NAME: string;
     INVOICE_NAME: string;
     CREATED_ON?: Date;
     COMMENT: string;
}
export class ErrorInvoice {
     ID: number;
     Plant_ID: string;
     DocumentType_ID: string;
     OutputType_ID: string;
     INV_NAME: string;
     INVOICE_NAME: string;
     CREATED_ON?: Date;
     COMMENT: string;
}
export class DSSConfiguration {
     CONFIG_ID: number;
     // DOCTYPE: string;
     Plant_ID: string;
     DocumentType_ID: string;
     OutputType_ID: string;
     AUTOSIGN: boolean;
     CERT_NAME: string;
     CERT_EX_DT: Date;
     AUTHORITY: string;
     DISPLAYTITLE1: string;
     DISPLAYTITLE2: string;
     PRIORITY1_USER: string;
     PRIORITY2_USER: string;
     PRIORITY3_USER: string;
     PRIORITY4_USER: string;
     PRIORITY5_USER: string;
     CREATED_ON?: Date;
     CREATED_BY: string;
     LASTMODIFIED_ON?: Date;
     LASTMODIFIED_BY: string;
}
export class UserByPlant {
     UserName: string;
     // DocumentType: string;
     Plant_ID: string;
     // Priority: string;
     DisplayTitle: string;
     IsSelected: boolean;
}
export class UserByPlantView {
     UserName: string;
     DocumentTypeID: string;
     DocumentType: string;
     PlantID: string;
     Plant: string;
     PriorityID: string;
     Priority: string;
     DisplayTitle: string;
}
export class DSSStatusCount {
     SignedDocumnentCount: number;
     ErrorDocumentCount: number;
     ConfigurationCount: number;
     ExpiryCerificateCount: number;
}

export class CertificateClass {
     CertificateName: string;
     ExpiryDate?: Date;
}

export class FilterClass {
     FromInvoice: number;
     ToInvoice: number;
     Plant_ID: string;
     DocumentType_ID: string;
     OutputType_ID: string;
     Authority: string;
     FromDate: string;
     ToDate: string;
     UserName: string;
}
