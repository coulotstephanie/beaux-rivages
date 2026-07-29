export type HousekeepingSnapshot={
 generatedAt:string;metrics:{arrivals:number;departures:number;ready:number;preparing:number;cleaning:number;blocked:number;urgent:number;lowStock:number;averageCleaningMinutes:number;averageInspectionMinutes:number;maintenanceCostCents:number};
 properties:{id:string;slug:string;name:string}[];
 tasks:{id:string;propertyId:string;propertyName:string;reservationReference:string;scheduledFor:string;assignee:string;status:string;operationalStatus:string;checklist:{id:string;label:string;done:boolean}[];notes:string;startedAt:string|null;completedAt:string|null;offlineRevision:number}[];
 inspections:{id:string;taskId:string;propertyName:string;inspector:string;rating:number|null;remarks:string;status:string;inspectedAt:string|null;createdAt:string}[];
 inventory:{id:string;propertyId:string;propertyName:string;room:string;category:string;name:string;quantity:number;valueCents:number;condition:string;purchasedOn:string|null;warrantyUntil:string|null}[];
 stock:{id:string;propertyId:string|null;propertyName:string;category:string;name:string;quantity:number;threshold:number;target:number;unit:string;low:boolean;lastRestockedAt:string|null}[];
 maintenance:{id:string;propertyId:string;propertyName:string;title:string;description:string;priority:string;status:string;assignee:string;costCents:number;dueAt:string|null;createdAt:string}[];
 interventions:{id:string;incidentId:string;incidentTitle:string;propertyName:string;assignee:string;provider:string;status:string;plannedFor:string|null;completedAt:string|null;costCents:number;notes:string}[];
 photos:{id:string;propertyName:string;kind:string;storagePath:string;caption:string;takenAt:string}[];
 recommendations:string[];
};
