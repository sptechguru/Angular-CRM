export interface UserFormFieldsModel {
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    package_id?: string;
    company_name?: string;
    services?: Array<string>;
    operating_countries?: Array<object>;
}