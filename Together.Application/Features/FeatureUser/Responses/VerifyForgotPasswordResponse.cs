namespace Together.Application.Features.FeatureUser.Responses;

public class VerifyForgotPasswordResponse
{
    public string AccessToken { get; set; } = default!;
    
    public int ExpiresInMinutes { get; set; }
}