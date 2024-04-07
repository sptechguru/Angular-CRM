import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { environment } from "environments/environment";



environment
class Endpoints {
    baseUrl: string = environment.baseUrl;
    AUTH_BASE = this.baseUrl + '/api/auth';
    USER_BASE = this.baseUrl + '/api/users';
    CRM_BASE = this.baseUrl + '/api/crm';
    UNICOMMERCE_BASE = this.baseUrl + '/api/unicommerce';


    ADMIN_AUTH_BASE = this.baseUrl + '/api/auth/admin';
    ADMIN_BASE = this.baseUrl + '/api/admin';
    MISCELLANEOUS_BASE = this.baseUrl + '/api';
    UPLOADED_RESOURCES_BASE = this.baseUrl + '/uploads/';
    GET_BLOG_DETAILS = ID => this.baseUrl + "/api/reseller/get-blog-detail/" + ID;
    UPLOADED_THUMB_RESOURCES_BASE = this.UPLOADED_RESOURCES_BASE + 'thumb/';

    STATE_API = this.baseUrl + '/api/reseller/get-states?offset=0&limit=36&country_id=1';


    CRM_ENDPOINTS = {
        CREATE_MENU: this.joinPaths(this.CRM_BASE, 'create-crm-menu'),
        PRODCUT_VARIANTS_NOTIFICATION: this.joinPaths(this.CRM_BASE, 'products-variants-details-notification'),
        PRODCUT_COUNT_EXCEL_SHEET: this.joinPaths(this.CRM_BASE, 'products-counts-excel-sheet'),
        PRODCUT_CALENDER_WISE: this.joinPaths(this.CRM_BASE, 'products-calender-wise'),
        COUNT_TOTAL_ORDERS: this.joinPaths(this.CRM_BASE, 'total-orders'),
        PRODCUT_COUNT_TOTAL_ORDERS: this.joinPaths(this.CRM_BASE, 'total-products/'),
        ROAD_BLOCKER_IMAGE: this.joinPaths(this.CRM_BASE, 'create-road-block-banner'),
        GET_ROAD_BANNER: this.joinPaths(this.CRM_BASE, 'get-road-block-banner'),
        UPDATE_MENU: ID => this.joinPaths(this.CRM_BASE, 'update-crm-menu', ID),
        GET_MENU: this.joinPaths(this.CRM_BASE, 'get-crm-menu'),
        PERMISSION_MENU: ID => this.joinPaths(this.CRM_BASE, 'crm-menu-permission', ID),
        GET_PERMISSION_MENU: ID => this.joinPaths(this.CRM_BASE, 'get-crm-menu-permission', ID),

        CREATE_CATELOG: this.joinPaths(this.CRM_BASE, 'create-catalogue'),
        GET_CATELOG: this.joinPaths(this.CRM_BASE, 'get-catalogues'),
        UPDATE_CATELOG: ID => this.joinPaths(this.CRM_BASE, 'update-catalogues', ID),
        DELETE_CATELOG: ID => this.joinPaths(this.CRM_BASE, 'delete-catalogue', ID),

        RESLLER_REQUEST: this.joinPaths(this.CRM_BASE, 'get-reseller-requests'),
        RESLLER_REQUEST_QOUTE: this.joinPaths(this.CRM_BASE, 'get-reseller-requests-with-quote'),
        RESLLER_HELP_AND_SUPPORT: this.joinPaths(this.CRM_BASE, 'get-reseller-help-and-support'),
        RESLLER_FEEDBACK: this.joinPaths(this.CRM_BASE, 'get-reseller-feedback'),



        CREATE_BLOG: this.joinPaths(this.CRM_BASE, 'create-blog'),
        BLOG_LIST: this.joinPaths(this.CRM_BASE, 'get-blog'),
        DELETE_BLOG: ID => this.joinPaths(this.CRM_BASE, 'delete-blog', ID),

        UPDATE_BLOG: ID => this.joinPaths(this.CRM_BASE, 'update-blog', ID),
        GET_BLOG_DETAILS: ID => this.joinPaths(this.CRM_BASE, 'get-blog-details', ID),
        UPDATE_PRODUCT_TAG: this.joinPaths(this.CRM_BASE, 'update-product-tag'),
        ASSIGN_CRM_USER: ID => this.joinPaths(this.CRM_BASE, 'assign-reseller-to-crm', ID),
        CRM_USER_ASSIGN_RESELLER: ID => this.joinPaths(this.CRM_BASE, 'resellers', ID),
        CRM_SUB_USER: ID => this.joinPaths(this.CRM_BASE, 'crm-user', ID),
        REMOVE_RESELLAR_FROM_USER: this.joinPaths(this.CRM_BASE, 'delete-crm-reseller'),
        GET_REQUEST_RECALL_BACK: this.joinPaths(this.CRM_BASE, 'get-requsetCall-back'),

        GET_PRODUCT_TAG: this.joinPaths(this.CRM_BASE, 'get-product-tags'),
        ADD_PRODUCT_TAG: this.joinPaths(this.CRM_BASE, 'add-product-tag'),
        DELETE_PRODUCT_TAG: ID => this.joinPaths(this.CRM_BASE, 'delete-product-tag', ID),
        ADD_PRODUCTS_INTO_DEALS: ID => this.joinPaths(this.CRM_BASE, 'add-products-into-deals', ID),
        GET_PRODUCTS_DEALS: ID => this.joinPaths(this.CRM_BASE, 'get-deals-products', ID),
        GET_FILTER_PRODUCT: this.joinPaths(this.CRM_BASE, 'get-filtered-products'),
        GET_DEALS_NAME: this.joinPaths(this.CRM_BASE, 'get-deals-name'),
        UPDATE_DEALS_NAME: ID => this.joinPaths(this.CRM_BASE, 'update-deal-name', ID),
        CREATE_NOTIFICATION: this.joinPaths(this.CRM_BASE, 'group-notification-for-reseller'),
        DELETE_NOTIFICATION: ID => this.joinPaths(this.CRM_BASE, 'delete-notification-content', ID),
        NOTIFICATION_LIST: this.joinPaths(this.CRM_BASE, 'get-notificayion-data'),
        NOTIFICATION_SEND: this.joinPaths(this.CRM_BASE, 'send-notification-content'),
        COLLECTION_LIST: this.joinPaths(this.baseUrl, '/api/home/get-collections'),
        ADD_COLLECTION: this.joinPaths(this.baseUrl, '/api/crm/create-cms-collections'),
        UPDATE_COLLECTION: ID => this.joinPaths(this.baseUrl, '/api/crm/update-cms-collections/', ID),
        DELETE_COLLECTION: ID => this.joinPaths(this.baseUrl, '/api/crm/delete-cms-collections', ID),
        SLIDER_IMAGE: this.joinPaths(this.CRM_BASE, 'slidebar-files'),
        DELETE_SLIDER_IMAGE: ID => this.joinPaths(this.CRM_BASE, 'delete-slidebar-files', ID),
        ULOAD_SLIDER_IMAGE: this.joinPaths(this.CRM_BASE, 'create-cms-file'),
        GET_USER_PROFILE: this.joinPaths(this.CRM_BASE, 'crm-user-profile'),
        CREATE_CRM_USER: this.joinPaths(this.CRM_BASE, 'onboarding-crm-user'),
        CRM_USER_LIST: this.joinPaths(this.CRM_BASE, 'crm-user-list'),
        ADD_PERMISSION_TO_CRM_USER: this.joinPaths(this.CRM_BASE, 'add-permissiom-to-crm-user'),
        PERMMISION_LIST: this.joinPaths(this.CRM_BASE, 'menu-list'),
        UPDATE_BUSINESS_NAME: this.joinPaths(this.CRM_BASE, 'update-business-name-by-crm'),
        UPDATE_CATEGORY_NAME: this.joinPaths(this.CRM_BASE, 'update-business-name-by-crm'),
        GET_KYC_LIST: this.joinPaths(this.CRM_BASE, 'get-kyc-list'),
        MANUAL_CANCEL_ORDER: this.joinPaths(this.CRM_BASE, 'manual-cancel-order-by-crm'),
        ADD_COMMENT: this.joinPaths(this.CRM_BASE, 'create-comment-on-order'),
        UPDATE_APK_VERSION: this.joinPaths(this.CRM_BASE, 'add-app-version'),
        COMMENT_LIST: this.joinPaths(this.CRM_BASE, 'order-comment-list'),
        UPDATE_KYC_ITEM_LIST: id => this.joinPaths(this.CRM_BASE, 'update-kyc-item-status', id),
        GET_ORDER_REVENUE: this.joinPaths(this.CRM_BASE, 'get-orders-revenue'),
        ACRIVE_RESELLER: this.joinPaths(this.CRM_BASE, 'active-reseller'),
        PENDING_KYC_LIST: this.joinPaths(this.CRM_BASE, 'pending-kyc-list'),
        SALE_CALENDER_WISE: this.joinPaths(this.CRM_BASE, 'sales-calender-wise'),
        KYC_ITEM_DETAILS: this.joinPaths(this.CRM_BASE, 'update-kyc-item-status'),
        RESELLER_LIST: this.joinPaths(this.CRM_BASE, 'reseller-list'),
        RESELLER_KYC_COUNT: this.joinPaths(this.CRM_BASE, 'reseller-kyc-count'),
        CONTACT_LIST: this.joinPaths(this.CRM_BASE, 'resellerUsers'),
        KYC_DETAIL: id => this.joinPaths(this.CRM_BASE, 'get-kyc-details', id),
        CATEGORY_LIST: this.joinPaths(this.CRM_BASE, 'get-product-categories'),
        CATEGORY_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-category'),
        CATEGORY_ADD: this.joinPaths(this.CRM_BASE, 'create-product-category'),
        CATEGORY_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product-category'),
        FACILITY_ADD: this.joinPaths(this.CRM_BASE, 'create-sku-facility'),
        FACILITY_UPDATE: this.joinPaths(this.CRM_BASE, 'update-sku-facility'),
        FACILITY_LIST: this.joinPaths(this.CRM_BASE, 'get-sku-facilities'),
        FACILITY_DELETE: this.joinPaths(this.CRM_BASE, 'delete-sku-facilities'),
        GST_TAX_TYPE_ADD: this.joinPaths(this.CRM_BASE, 'create-gst-tax-type-class'),
        GST_TAX_TYPE_UPDATE: this.joinPaths(this.CRM_BASE, 'update-gst-tax-type-class'),
        GST_TAX_TYPE_LIST: this.joinPaths(this.CRM_BASE, 'get-gst-tax-type-classes'),
        GST_TAX_TYPE_DELETE: this.joinPaths(this.CRM_BASE, 'delete-gst-tax-type-class'),
        GST_TAX_TYPE_LIST_BY_ID: this.joinPaths(this.CRM_BASE, 'get-gst-tax-type-class-details'),
        CONTACT_QUERY_LIST: this.joinPaths(this.CRM_BASE, 'get-contact-us-list'),
        CONTACT_QUERY_DELETE: this.joinPaths(this.CRM_BASE, 'delete-contact-us'),
        CONTACT_QUERY_DETAILS: this.joinPaths(this.CRM_BASE, 'get-contact-us-details'),
        CLIENT_LIST: this.joinPaths(this.CRM_BASE, 'get-business-clients'),
        CLIENT_ADD: this.joinPaths(this.CRM_BASE, 'create-business-client'),
        CLIENT_UPDATE: this.joinPaths(this.CRM_BASE, 'update-business-client'),
        CLIENT_DELETE: this.joinPaths(this.CRM_BASE, 'delete-business-client'),
        PARTNER_LIST: this.joinPaths(this.CRM_BASE, 'get-business-partners'),
        PARTNER_DELETE: this.joinPaths(this.CRM_BASE, 'delete-business-partner'),
        PARTNER_ADD: this.joinPaths(this.CRM_BASE, 'create-business-partner'),
        PARTNER_UPDATE: this.joinPaths(this.CRM_BASE, 'update-business-partner'),
        BUSINESSTYPE_LIST: this.joinPaths(this.CRM_BASE, 'get-business-types'),
        BUSINESSTYPE_DELETE: this.joinPaths(this.CRM_BASE, 'delete-business-type'),
        BUSINESSTYPE_ADD: this.joinPaths(this.CRM_BASE, 'create-business-type'),
        BUSINESSTYPE_UPDATE: this.joinPaths(this.CRM_BASE, 'update-business-type'),
        TRADE_ASSURANCE: this.joinPaths(this.CRM_BASE, 'get-trade-assurance'),
        HEADER_TAG: this.joinPaths(this.CRM_BASE, 'get-header-tags'),
        PRODUCT_LISTS: this.joinPaths(this.CRM_BASE, 'get-products'),
        PRODUCT_LIST: this.joinPaths(this.CRM_BASE, 'get-products-variants'),
        PRODUCT_ATTRIBUTE_BY_ID: this.joinPaths(this.CRM_BASE, 'get-product-attributes-with-value'),
        PRODUCT_DETAILS: this.joinPaths(this.CRM_BASE, 'get-product-details'),
        PRODUCT_DETAILS_NEW: this.joinPaths(this.CRM_BASE, 'get-product-details'),
        PRODUCT_ADD: this.joinPaths(this.CRM_BASE, 'create-product'),
        PRODUCT_ADD_NEW: this.joinPaths(this.CRM_BASE, 'v-create-product'),
        PRODUCT_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product'),
        PRODUCT_UPDATE_NEW: this.joinPaths(this.CRM_BASE, 'v-update-product'),
        PRODUCT_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product'),
        PRODUCT_XLS: this.joinPaths(this.CRM_BASE, 'get-all-products-excel-file'),
        PRODUCT_SAMPLE_XLS: this.joinPaths(this.CRM_BASE, 'get-sample-excel-file'),
        PRODUCT_SAMPLE_FIELD_XLS: this.joinPaths(this.CRM_BASE, 'get-sample-value-excel-file'),
        PRODUCT_ADD_BULK: this.joinPaths(this.CRM_BASE, 'create-bulk-products'),
        PRODUCTATTRIBUTE_LIST: this.joinPaths(this.CRM_BASE, 'get-product-attributes'),
        PRODUCTATTRIBUTE_ADD: this.joinPaths(this.CRM_BASE, 'create-product-attribute'),
        PRODUCTATTRIBUTE_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product-attribute'),
        PRODUCTATTRIBUTE_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-attribute'),
        PRODUCTATTRIBUTE_VALUE_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-attribute-value'),
        PRODUCTVARIANT_LIST: this.joinPaths(this.CRM_BASE, 'get-product-variants'),
        PRODUCTVARIANT_ADD: this.joinPaths(this.CRM_BASE, 'create-product-variant'),
        PRODUCTVARIANT_BULK_ADD: this.joinPaths(this.CRM_BASE, 'create-bulk-product-variant'),
        PRODUCTVARIANT_BULK_EXCEL_ADD: this.joinPaths(this.CRM_BASE, 'create-bulk-product-variant-excel'),
        PRODUCTVARIANT_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product-variant'),
        PRODUCTVARIANT_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-variant'),
        PRODUCTVARIANT_DETAILS: this.joinPaths(this.CRM_BASE, 'get-product-variant-details'),
        PRODUCTVARIANTIMAGE_LIST: this.joinPaths(this.CRM_BASE, 'get-products-variant-images'),
        PRODUCTVARIANTIMAGE_ADD: this.joinPaths(this.CRM_BASE, 'create-product-variant-image'),
        PRODUCTVARIANTIMAGE_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product-variant-image'),
        PRODUCTVARIANTIMAGE_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-variant-image'),
        ADDATTRIBUTE_PRODUCT: this.joinPaths(this.CRM_BASE, 'add-attribute-to-product'),
        ADDATTRIBUTE_VARIANT: this.joinPaths(this.CRM_BASE, 'add-attribute-to-variant'),
        ADDATTRIBUTEVALUE_PRODUCT: this.joinPaths(this.CRM_BASE, 'get-product-attributes-with-value'),
        ADDATTRIBUTEVALUE_VARIANT: this.joinPaths(this.CRM_BASE, 'get-variant-attributes-with-value'),
        PRODUCTVARIANT_LEAD: this.joinPaths(this.CRM_BASE, 'create-product-variant-lead-time'),
        PRODUCTVARIANT_BULK_LEAD: this.joinPaths(this.CRM_BASE, 'create-bulk-product-variant-lead-time'),
        PRODUCTVARIANT_BULK_LEAD_UPDATE: this.joinPaths(this.CRM_BASE, 'update-bulk-product-variant-lead-time'),
        PRODUCTVARIANT_BULK_LEAD_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-variant-lead-time'),
        PRODUCTVARIANT_OFFER: this.joinPaths(this.CRM_BASE, 'create-product-variant-offer-price'),
        PRODUCTVARIANT_BULK_OFFER: this.joinPaths(this.CRM_BASE, 'create-bulk-product-variant-offer-price'),
        PRODUCTVARIANT_BULK_OFFER_UPDATE: this.joinPaths(this.CRM_BASE, 'update-bulk-product-variant-offer-price'),
        PRODUCTVARIANT_BULK_OFFER_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-variant-offer-price'),
        VARIANT_TAG_DELETE: this.joinPaths(this.CRM_BASE, 'delete-product-tag-new'),
        ORDER_LIST: this.joinPaths(this.CRM_BASE, 'get-orders'),
        ORDER_DETAILS: this.joinPaths(this.CRM_BASE, 'get-order-details'),
        BRANDINGAMOUNT_ADD: this.joinPaths(this.CRM_BASE, 'add-branding-item-amount'),
        MAKEMANUALPAYMENT: this.joinPaths(this.CRM_BASE, 'make-manual-payment'),
        APPROVEPAYMENT: this.joinPaths(this.CRM_BASE, 'check-payment-and-mark-order-created'),
        ADDBILLTOORDER: this.joinPaths(this.CRM_BASE, 'save-order-bills'),
        GET_ORDER_SHIPMENT: this.joinPaths(this.CRM_BASE, 'get-order-shipments'),
        //UPDATE_BILL_TO_ORDER: this.joinPaths(this.CRM_BASE, 'add-bills-to-order'),
        BILL_LIST: this.joinPaths(this.CRM_BASE, 'get-order-bills'),
        CREATE_PACKAGING_LIST: (order_id, id) => this.joinPaths(this.CRM_BASE, 'create-packaging-list', order_id, id),
        DOWNLOAD_ORDER_BILLS: (order_id, id, bill_type) => this.joinPaths(this.CRM_BASE, '/api/crm/download-order-bills', order_id, id, bill_type),
        GET_PRODUCT_ATTRIBUTE_DETAILS: this.joinPaths(this.CRM_BASE, 'get-product-attribute-details'),
        SKU_BULK_UPDATE: this.joinPaths(this.CRM_BASE, 'update-product-variant-quantity'),
        //Product_by_ID:this.joinPaths(this.CRM_BASE,'get-product-details'),
        Product_by_ID: this.joinPaths(this.CRM_BASE, 'get-product-variants-details'),
        Product_quantity_adjustment: this.joinPaths(this.CRM_BASE, 'get-adjustment-history-list'),
        Delivery_BULK_UPLOAD: this.joinPaths(this.CRM_BASE, 'create-bulk-track-shipment'),
        Delivery_List: this.joinPaths(this.CRM_BASE, 'get-track-shipments'),
        Delivery_Edit: this.joinPaths(this.CRM_BASE, 'get-track-shipment'),
        Delivery_Update: this.joinPaths(this.CRM_BASE, 'update-bulk-track-shipment'),

        PRODUCT_BY_ID: this.joinPaths(this.CRM_BASE, 'get-product-details'),
        ADD_TRADE_ASSURANCE: this.joinPaths(this.CRM_BASE, 'create-trade-assurance'),
        GET_ALL_TRADE_ASSURANCE: this.joinPaths(this.CRM_BASE, 'get-trade-assurance'),
        UPDATE_TRADE_ASSURANCE: this.joinPaths(this.CRM_BASE, 'update-trade-assurance'),
        CREATE_RESELLER_USER: this.joinPaths(this.CRM_BASE, 'create-reseller-user'),
        UPDATE_RESELLER_USER: this.joinPaths(this.CRM_BASE, 'update-reseller-user'),
        GET_RESELLER_DETAILS: this.joinPaths(this.CRM_BASE, 'get-reseller-details/')
    }

    UNICOMMERCE_ENDPOINTS = {
        GET_INVOICE_FROM_UNICOMMERCE: (CODE) => this.joinPaths(this.UNICOMMERCE_BASE, 'get-invoice-from-unicommerce', CODE)
    }

    AUTH_ENDPOINTS = {
        LOGIN_IN: this.joinPaths(this.ADMIN_AUTH_BASE, 'login'),
        SIGN_UP: this.joinPaths(this.AUTH_BASE, 'signup'),
        UPDATE_PROFILE: this.joinPaths(this.AUTH_BASE, 'update-profile'),
        SUBSCRIPTION_LIST: this.joinPaths(this.AUTH_BASE, 'get-subscription-packages'),
        FORGET_PASSWORD: this.joinPaths(this.AUTH_BASE, 'forgot-password'),
        RESET_PASSWORD: this.joinPaths(this.AUTH_BASE, 'reset-password'),
        VERIFY_EMAIL: this.joinPaths(this.AUTH_BASE, 'verify-email'),
        CHANGE_PASSWORD: this.joinPaths(this.AUTH_BASE, 'change-password'),
        LOGOUT: this.joinPaths(this.AUTH_BASE, 'logout')
    };

    USER_ENDPONTS = {
        CHANGE_PASSWORD: this.joinPaths(this.USER_BASE, 'change-password'),
        LOGOUT: this.joinPaths(this.USER_BASE, 'logout'),
        MY_DETAILS: this.joinPaths(this.USER_BASE, 'my-details'),
        Business_Profile: this.joinPaths(this.USER_BASE, 'upload-company-logo'),
        Update_Business_Profile: this.joinPaths(this.USER_BASE, 'update-business-profile'),
        APK_VERSION: this.joinPaths(this.USER_BASE, 'get-app-version'),
        USER_ROLE: this.joinPaths(this.USER_BASE, 'get-role'),
        USER_DETAILS: ID => this.joinPaths(this.USER_BASE, 'user-details', ID),
    };
    MISCELLANEOUS_ENDPOINTS = {
        GET_COUNTRY_LIST: this.joinPaths(this.MISCELLANEOUS_BASE, 'country'),
        GET_STATE_LIST: this.joinPaths(this.MISCELLANEOUS_BASE, 'state')
    };
    ADMIN_USER_ENDPOINTS = {
        GET_USER_LIST: this.joinPaths(this.ADMIN_BASE, 'user'),
        USER_STATUS_UPDATE_URL: (status, id) => this.joinPaths(this.ADMIN_BASE, 'change-user-status', status, id),
        GET_ALL_USER_LIST: this.joinPaths(this.ADMIN_BASE, 'get-all-users-list'),
        ADD_USER: this.joinPaths(this.ADMIN_BASE, 'user'),
        USER_DETAIL: id => this.joinPaths(this.ADMIN_BASE, 'get-user-details', id),
        UPDATE_USER: id => this.joinPaths(this.ADMIN_BASE, 'save-user', id),
        USER_LABOUR_WAGES_URL: this.joinPaths(this.ADMIN_BASE, 'save-labour-wages'),
        USER_USER_ACCOUNT_URL: this.joinPaths(this.ADMIN_BASE, 'add-user-account'),
        DELETE_USER: id => this.joinPaths(this.ADMIN_BASE, id),
        CHANGE_USER_PASSWORD: id => this.joinPaths(this.ADMIN_BASE, id, 'change-password'),
        GET_USER_ACCOUNT_LIST: this.joinPaths(this.ADMIN_BASE, 'get-user-account-list'),
        UPDATE_RESELLER_STATUS: this.joinPaths(this.CRM_BASE, 'update-reseller-status'),
        UPDATE_RESELLER_EMAIL_VERIFY: this.joinPaths(this.CRM_BASE, 'verify-reseller-email'),
        UPDATE_PRODUCT_STATUS: this.joinPaths(this.CRM_BASE, 'update-product-status'),
        UPDATE_VARIANT_STATUS: this.joinPaths(this.CRM_BASE, 'update-variant-status')
    };
    SHIPING_ENDPOINTS = {
        GET_READY_STOCK: this.joinPaths(this.baseUrl, 'api/crm/get-cms-shipping-zones'),
        UPDATE_READY_STOCK: ID => this.joinPaths(this.baseUrl, 'api/crm/update-cms-shipping-timing', ID),
        GET_READY_STOCKBYID: ID => this.joinPaths(this.baseUrl, 'api/crm/get-cms-shipping-zone', ID)
    }
    private joinPaths(...params) {
        const newUrl = params.join('/');
        return newUrl;
    }
}
export const API = new Endpoints();
