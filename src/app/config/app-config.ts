import { environment } from '../../environments/environment';

const BASE_URL = environment.apiEndpoint;
const API = 'api';
const API_V1 = environment.apiVersion; // 'api/v1';
const Front = environment.frontEndURL;
export const CONFIG = {
    //Front End URL
    FrontURL:Front,
    userProfileURL:"talent/",
    companyProfileURL:"company/",
    jobViewURL: "job/",
    //oauth
    userAuthURL: BASE_URL + API_V1 + '/oauth/signin',
    forgotPassURL: BASE_URL + API_V1 + '/admin/password/forgot-password',
    validateResetPassURL: BASE_URL + API_V1 + '/admin/password/validate_reset_token',
    resetPassURL: BASE_URL + API_V1 + '/admin/password/reset',
    //after oauth
    getUserProfileIdURL: BASE_URL + API_V1 + '/admin/profile',
    
    /* DASHBOARD - API */
    getDashboardDataURL:BASE_URL + API_V1 + '/admin/dashboard/get-summary',
    getDashboardDatastaticsURL: BASE_URL + API_V1 + '/admin/dashboard/get-statistics',
    getAllactivejobsURL: BASE_URL + API_V1 + '/admin/dashboard/get-active-jobs',
    getUnverifiedcompanyURL: BASE_URL + API_V1 + '/admin/dashboard/get-unverified-companies',
    getAllnewpostedjobsURL: BASE_URL + API_V1 + '/admin/dashboard/get-new-posted-jobs',
    
     /* GENEREL - API */
     getCountriesListURL:BASE_URL + API_V1 + '/admin/get-country',
    

    /* CMS MANAGEMENT - API */
    createCmsURL: BASE_URL + API + '/content_page/create',
    updateCmsURL: BASE_URL + API + '/content_page/update/',
    getCmsByIdURL: BASE_URL + API + '/content_page/show/',
    getAllCmsListURL: BASE_URL + API + '/content_page/list',
    changeCmsStatusURL: BASE_URL + API + '/content_page/change_status',
    filebrowserUploadUrl : BASE_URL + API_V1 + '/admin/image/upload-image',

    /* EMAIL TEMPLATE - API */
    updateEmailURL: BASE_URL + API + '/email_template/update/',
    getEmailByIdURL: BASE_URL + API + '/email_template/show/',
    getAllEmailListURL: BASE_URL + API + '/email_template/list',
    emailTemplateStatusChangeURL: BASE_URL + API + '/email_template/change_status',

    /* FAQ MANAGEMENT - API */
    getAllFaqListURL: BASE_URL + API + '/faq/list',
    getFaqByIdURL: BASE_URL + API + '/faq/show/',
    changeFaqStatusURL: BASE_URL + API + '/faq/change_status',
    getFaqTopicListURL: BASE_URL + API + '/faq_topic/list',
    deleteFaqURL: BASE_URL + API + '/faq/delete/',
    updateFaqURL: BASE_URL + API + '/faq/update/',
    createFaqURL: BASE_URL + API + '/faq/create',

    /* MANAGE SUBADMIN - API */
    getAllSubadminListURL: BASE_URL + API + '/subadmin/list',
    changeSubadminPassURL: BASE_URL + API + '/subadmin/password/change',
    changeSubadminStatusURL: BASE_URL + API + '/subadmin/change_status',
    deleteSubadminURL: BASE_URL + API + '/subadmin/delete/',
    getActiveRoleURL: BASE_URL + API + '/role/list_active/0',
    getSubadminByIdURL: BASE_URL + API + '/subadmin/show/',
    updateSubadminURL: BASE_URL + API + '/subadmin/update/',
    createSubadminURL: BASE_URL + API + '/subadmin/create',

    /* MANAGE USER - API */
    getAllManageUserListURL: BASE_URL + API_V1 + '/user/list',
    changeManageUserPassURL: BASE_URL + API + '/user/password/change',
    changeManageUserStatusURL: BASE_URL + API + '/user/change_status',
    deleteManageUserURL: BASE_URL + API + '/user/delete/',
    deleteUserProfileURL: BASE_URL + API + '/user/delete-profile/',
    getManagerUserByIdURL: BASE_URL + API + '/user/show/',
    updateManageUserURL: BASE_URL + API + '/user/update/',
    createManageUserURL: BASE_URL + API + '/user/create',

     /* MANAGE Employeer - API */
     getAllEmployeerList: BASE_URL + API_V1 + '/admin/manage-employers/listing',
     getEmployeerById: BASE_URL + API_V1 + '/admin/manage-employers/',
     updateUserDetails: BASE_URL + API_V1 + '/admin/manage-employers/update/',
     changeEmployeerStatus: BASE_URL + API_V1 + '/admin/manage-employers/change-status/',
     changeCompanyEmployeerVarifiedStatus: BASE_URL + API_V1 + '/admin/manage-employers/change-action/',
     getEmployeerReport: BASE_URL + API_V1 + '/admin/reports/employers-report',
     getEmployeerReportPDF: BASE_URL + API_V1 + '/admin/reports/employers-report-pdf',
     getSericesListURL: BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=services',
     getSizeListURL: BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=size',
     addCompanyCreditURL: BASE_URL + API_V1 + '/admin/company-credit/add',
     updateCompanyCreditURL: BASE_URL + API_V1 + '/admin/company-credit/update',
     CompanyCreditListURL: BASE_URL + API_V1 + '/admin/company-credits-list/',
     deleteCompanyCreditURL: BASE_URL + API_V1 + '/admin/company-credit-delete/',
     updateGeneralInfoURL: BASE_URL + API_V1 + '/admin/general-info/update',
     updateContactInfoURL: BASE_URL + API_V1 + '/admin/contact-details/update',
     updateLegalInfoURL: BASE_URL + API_V1 + '/admin/legal-info/update',
     updateAdditionalInfoURL: BASE_URL + API_V1 + '/admin/additional-info/update',
     uploadCompanyLogo: BASE_URL + API_V1 + '/admin/upload_company_logo',
     removeCompanyLogo: BASE_URL + API_V1 + '/admin/remove_company_logo',
     

    /* SETTINGS API */
    getSettingsDataURL: BASE_URL + API + '/configuration/list',
    getSettingsSaveDataURL: BASE_URL + API + '/configuration/update',
    getSettingsRemoveImageURL: BASE_URL + API + '/configuration/delete-image/',
    getSettingsImageDataURL: BASE_URL + API + '/configuration/images',

    /* MANAGE CATEGORY - API */
    getAllCategoryListURL: BASE_URL + API + '/category/list',
    getCategoryByIdURL: BASE_URL + API + '/category/show/',
    changeCategoryStatusURL: BASE_URL + API + '/category/change_status',
    deleteCategoryURL: BASE_URL + API + '/category/delete/',
    updateCategoryURL: BASE_URL + API + '/category/update/',
    createCategoryURL: BASE_URL + API + '/category/create',
    getCategoryTreeviewURL: BASE_URL + API + '/category/treeview/ng6',
    createCategoryTreeURL: BASE_URL + API + '/category/save',

    /* SYSTEM PERMISSIONS - API */
    getAllRoleListURL: BASE_URL + API + '/role/list',
    changeRoleStatusURL: BASE_URL + API + '/role/change_status',
    createRoleURL: BASE_URL + API + '/role/create',
    updateRoleURL: BASE_URL + API + '/role/update/',
    getAllPermissionListURL: BASE_URL + API + '/permission/list',
    assignPermissionURL: BASE_URL + API + '/permission/role_assign/',

    updateProfileInfoURL: BASE_URL + API + '/subadmin/update_profile',
    changeProfilePassURL: BASE_URL + API_V1 + '/admin/password/change',

    // Production Types
    profileProperties: {
        getPropertyTypes: BASE_URL + API_V1 + '/admin/config/profile-properties',
        getPropertyType: BASE_URL + API_V1 + '/admin/profile-property',
        getListingURL: BASE_URL + API_V1 + '/admin/profile-property/get-list',
        getChangeStatusURL: BASE_URL + API_V1 + '/admin/profile-property/change-status',
        getDeleteRecordURL: BASE_URL + API_V1 + '/admin/profile-property/',
        getAddRecordURL: BASE_URL + API_V1 + '/admin/profile-property/add',
        getUpdateRecordURL: BASE_URL + API_V1 + '/admin/profile-property/update',
        getServices: BASE_URL + API_V1 + '/admin/profile-property/get-service',
    },

    /* HCC MANAGEMENT - API */
    createHCCURL: BASE_URL + API_V1 + '/admin/help-center/add-category',
    updateHCCURL: BASE_URL + API_V1 + '/admin/help-center/update-category',
    getHCCByIdURL: BASE_URL + API_V1 + '/admin/help-center/show-category',
    getAllHCCListURL: BASE_URL + API_V1 + '/admin/help-center/get-category',
    deleteHCCURL: BASE_URL + API_V1 + '/admin/help-center/delete-category',

    /* HCQ MANAGEMENT - API */
    createHCQURL: BASE_URL + API_V1 + '/admin/help-center-questions/add-question',
    updateHCQURL: BASE_URL + API_V1 + '/admin/help-center-questions/update-question',
    getHCQByIdURL: BASE_URL + API_V1 + '/admin/help-center-questions/show-question',
    getAllHCQListURL: BASE_URL + API_V1 + '/admin/help-center-questions/get-question-list',
    deleteHCQURL: BASE_URL + API_V1 + '/admin/help-center-questions/delete-question',

     /* RECOMMENDATIONS - API */
     getCompanyrecommendationListURL:BASE_URL + API_V1 + '/admin/company-recommendation/list',
     getUserrecommendationListURL:BASE_URL + API_V1 + '/admin/user-recommendation/list',
     deleteCompanyrecommendationURL:BASE_URL + API_V1 + '/admin/company-recommendation/delete/',
     deleteUserrecommendationURL:BASE_URL + API_V1 + '/admin/user-recommendation/delete/',
     getRecommendationListURL:BASE_URL + API_V1 + '/admin/recommendation/list',
     changeRecommendationStatusURL:BASE_URL + API_V1 + '/admin/recommendation/change-status/',

     /* TALENT & CREW MANAGEMENT - API */
    getTalentCrewListURL: BASE_URL + API_V1 + '/admin/talent-crew/list',
    changeStatusTalentCrewURL: BASE_URL + API_V1 + '/admin/talent-crew/status/',
    getEthnicityListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=ethnicities',
    getBodyTypeListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=body-types',
    getHairColorListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=hair-colors',
    getEyeColorListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=eye-colors',
    getUserTypeListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=tnc-type',
    getTalentDetailsURL:BASE_URL + API_V1 + '/admin/talent-crew/',
    getSpokenLanguageListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=spoken-languages',
    getExperienceListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=experience-in',
    getSkillsListURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=skills',
    getProductionTypeList:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=production-types',
    getExperienceInYearList:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=years-of-exp',
    updateTelentCrewURL:BASE_URL + API_V1 + '/admin/talent-crew/edit/',
    addCreditURL:BASE_URL + API_V1 + '/admin/add-credit',
    getCreditListURL:BASE_URL + API_V1 + '/admin/get-credit-list/',
    deleteCreditURL:BASE_URL + API_V1 + '/admin/credit/delete/',
    updateCreditURL:BASE_URL + API_V1 + '/admin/credit/edit/',
    getTalentReport: BASE_URL + API_V1 + '/admin/reports/job-seeker-report-csv',
    getTalentReportPDF: BASE_URL + API_V1 + '/admin/reports/job-seeker-report-pdf',

    /* JOB MANAGEMENT - API */
    getAllManageJobListURL:BASE_URL + API_V1 + '/admin/job/job-list',
    deleteManageJobURL:BASE_URL + API_V1 + '/admin/job/change-job-status',
    getJobViewDetailByIdURL:BASE_URL + API_V1 + '/admin/job/get-details/',
    getEmploymentStatusURL:BASE_URL + API_V1 + '/admin/profile-property/get-service?property_type=employment-status',
    getJobReportCSV: BASE_URL + API_V1 + '/admin/reports/job-report-csv',
    changeJobFeaturedURL:BASE_URL + API_V1 + '/admin/job-management/mark-featured/',
    approveJobURL: BASE_URL + API_V1 + '/admin/job-management/job/approve/',
    rejectJobURL: BASE_URL + API_V1 + '/admin/job-management/job/reject/',

    /* SUBSCRIPTION */
    getSubscriptionListURL: BASE_URL + API_V1 + '/admin/subscription/get-subscription-list',
    updateSubscriptionURL: BASE_URL + API_V1 + '/admin/subscription/change-subscription-amount',
    changeSubStatusURL: BASE_URL + API_V1 + '/admin/subscription/change-subscription-status',

    /* RECEIPT */
    getReceiptListURL: BASE_URL + API_V1 + '/admin/payment/get-payment-receipts',
    getReceiptReport: BASE_URL + API_V1 + '/admin/subscription/report/receipts-report-csv',
    getReceiptReportPDF: BASE_URL + API_V1 + '/admin/subscription/report/receipts-report-pdf',

    /* SUBSCRIPTION PERMISSION */
    getSubPermissionList: BASE_URL + API_V1 + '/admin/subscription-permission/subscription-permission-list',
    changeSubPermissionStatus: BASE_URL + API_V1 + '/admin/subscription-permission/subscription-permission-status',
    editSubPermissionById: BASE_URL + API_V1 + '/admin/subscription-permission/edit-subscription-permission',
};

