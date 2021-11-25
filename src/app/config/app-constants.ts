import {SPINNER } from 'ngx-ui-loader';
import { CONFIG } from './app-config';
const LOGO_URL="assets/img/app-loader-white.gif";

let currentUser = JSON.parse(localStorage.getItem('currentUser'));

export const CONFIGCONSTANTS = {
      minYearForYearSelect:1900,
      // toolbar:[
      //   { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
      //   // { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      //   // { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
      //   // { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
      //   '/',
      //   { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
      //   { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
      //   { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
      //   // { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
      //   '/',
      //   { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
      //   { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
      //   { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
      //   // { name: 'about', items: [ 'About' ] }
      // ]
    'CK-Editor-config':{
      allowedContent:true,
      extraPlugins: 'sourcedialog,uploadimage,image2',  
      forcePasteAsPlainText: true,
      removePlugins:'sourcearea',
      language:'en',
      removeButtons:"Save,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,About",
      filebrowserUploadUrl : CONFIG.filebrowserUploadUrl,
      fileTools_requestHeaders : {
        Authorization: `Bearer ${currentUser != null ? currentUser.data.access_token : ''}`
      },
    },
    
    'Data-Table-Empty-error':'No Data Found',
    'date-formate':'MM/DD/YYYY'   ,
    loaderConfig:{
      logoUrl: LOGO_URL,
      logoSize: 110,
      spinnerType: SPINNER.ballSpinClockwise,
      bgsColor:"#ffffff"
    },
    currency: "USD",

    /* SAVE LISTING PREVIOUS DATA OBJECT NAMES */
    adminListing: 'admin-listing',
    manageEmployersList: 'manage_employers_list',
    talentAndCrewList: 'talent_and_crew_list',
    manageJobList: 'manage_job_list',
    receiptManageList: 'receipt_list',
    manageRecommendationsList: 'manage_recommendations',
    skillManagementList: 'skill_management_list',
    cmsManagementList: 'cms_management_list',
    DataTablesSkillTable:'DataTables_skillTable_/',
    DataTablesExample: 'DataTables_example_/',
    DataTablesCmsTable: 'DataTables_cmsTable_/',
    subscriptionPermissionList: 'subscription_permission_list',
};
