import{z}from"zod";const item=z.object({id:z.string().min(1).max(80),label:z.string().min(1).max(180),done:z.boolean()}).strict();
export const housekeepingActionSchema=z.discriminatedUnion("action",[
z.object({action:z.literal("update_task"),taskId:z.string().uuid(),operationalStatus:z.enum(["to_prepare","cleaning","quality_control","ready","maintenance","blocked","urgent"]),checklist:z.array(item).max(60),offlineRevision:z.number().int().min(0)}).strict(),
z.object({action:z.literal("inspect"),taskId:z.string().uuid(),inspector:z.string().trim().min(2).max(120),rating:z.number().int().min(1).max(5).optional(),remarks:z.string().trim().max(1500).optional(),status:z.enum(["approved","correction_required"])}).strict(),
z.object({action:z.literal("adjust_stock"),stockId:z.string().uuid(),quantity:z.number().min(0).max(100000)}).strict(),
z.object({action:z.literal("create_inventory"),propertyId:z.string().uuid(),room:z.string().trim().min(1).max(120),category:z.string().trim().min(1).max(100),name:z.string().trim().min(1).max(180),quantity:z.number().int().min(0).max(10000),unitValueCents:z.number().int().min(0).max(10000000),condition:z.enum(["new","good","worn","damaged","missing"])}).strict(),
z.object({action:z.literal("plan_intervention"),incidentId:z.string().uuid(),assignee:z.string().trim().max(120).optional(),provider:z.string().trim().max(120).optional(),plannedFor:z.string().datetime(),notes:z.string().trim().max(1500).optional()}).strict(),
z.object({action:z.literal("update_intervention"),interventionId:z.string().uuid(),status:z.enum(["planned","assigned","postponed","in_progress","completed","cancelled"])}).strict()
]);
export type HousekeepingAction=z.infer<typeof housekeepingActionSchema>;
