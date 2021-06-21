// Auth events
const USER_REGISTERED_EVENT               = 'user_registered';
const FORGOT_PASSWORD_EVENT               = 'forgot_password';
const RESET_PASSWORD_EVENT                = 'reset_password'
const USER_VERIFIED_EVENT                 = 'user_verified';

// Proposal Events
const PROPOSAL_ACCEPTED_EVENT             = 'proposal_accepted';

// Presentation Events
const PRESENTATION_CREATED_EVENT          = 'presentation_created';
const PRESENTATION_COMPLETED_EVENT        = 'presentation_completed';

// Billing events
const BILLING_PAID_EVENT                  = 'billing_paid';

// File Events
const DELETE_FILE_EVENT                   = 'delete_file';
const DOCUMENT_SENT_FOR_APPROVAL_EVENT    = 'document_sent_for_approval';

// Notification Events
const ASK_USER_TO_COMPLETE_PROFILE_EVENT  = 'ask_user_to_complete_profile';
const ASK_USER_TO_CREATE_PRODUCT_EVENT    = 'ask_user_to_create_product';

module.exports = {
  USER_REGISTERED_EVENT,
  FORGOT_PASSWORD_EVENT,
  RESET_PASSWORD_EVENT,
  USER_VERIFIED_EVENT,

  PROPOSAL_ACCEPTED_EVENT,
  PRESENTATION_CREATED_EVENT,
  PRESENTATION_COMPLETED_EVENT,
  BILLING_PAID_EVENT,

  DOCUMENT_SENT_FOR_APPROVAL_EVENT,
  DELETE_FILE_EVENT,

  ASK_USER_TO_COMPLETE_PROFILE_EVENT,
  ASK_USER_TO_CREATE_PRODUCT_EVENT,
};