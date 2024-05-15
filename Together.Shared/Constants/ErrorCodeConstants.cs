namespace Together.Shared.Constants;

public static class ErrorCodeConstants
{
    public static class Server
    {
        public const string InternalServer = "INTERNAL_SERVER_ERROR";
        public const string Unauthorized = "UNAUTHORIZED";
    }
    
    public static class Pagination
    {
        public const string PageIndexCannotBeNull = "PAGE_INDEX_CANNOT_BE_NULL";
        public const string PageIndexMustBeGreaterThanZero = "PAGE_INDEX_MUST_BE_GREATER_THAN_0";
        public const string PageSizeCannotBeNull = "PAGE_SIZE_CANNOT_BE_NULL";
        public const string PageSizeMustBeGreaterThanZero = "PAGE_SIZE_MUST_BE_GREATER_THAN_0";
    }
    
    public static class Email
    {
        public const string EmailCannotBeEmpty = "EMAIL_CANNOT_BE_EMPTY";
        public const string EmailInvalid = "EMAIL_INVALID";
        public const string DuplicateEmail = "DUPLICATE_EMAIL";
    }
    
    public static class User
    {
        public const string UsernameDuplicate = "DUPLICATE_USERNAME";
        public const string ForgotPasswordTokenInvalid = "FORGOT_PASSWORD_TOKEN_INVALID";
        public const string IncorrectPassword = "INCORRECT_PASSWORD";
        public const string NotFound = "USER_NOT_FOUND";
    }
    
    public static class Storage
    {
        
    }
    
    public static class Follow
    {
        public const string FollowDuplicate = "DUPLICATE_FOLLOW";
    }
    
    public static class Conversation
    {
        public const string RequestSendMessageInvalid = "REQUEST_SEND_MESSAGE_INVALID";
        public const string ConversationExisted = "CONVERSATION_EXISTED";
        public const string ConversationNotFound = "CONVERSATION_NOT_FOUND";
    }
}