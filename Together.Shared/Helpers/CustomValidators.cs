using FluentValidation;
using Together.Shared.Constants;
using Together.Shared.ValueObjects;

namespace Together.Shared.Helpers;

public class PaginationValidator : AbstractValidator<IPaginationRequest>
{
    public PaginationValidator()
    {
        RuleFor(x => x.PageIndex)
            .NotNull().WithErrorCode(ErrorCodeConstants.Pagination.PageIndexCannotBeNull)
            .GreaterThan(0).WithErrorCode(ErrorCodeConstants.Pagination.PageIndexMustBeGreaterThanZero);
        RuleFor(x => x.PageSize)
            .NotNull().WithErrorCode(ErrorCodeConstants.Pagination.PageSizeCannotBeNull)
            .GreaterThan(0).WithErrorCode(ErrorCodeConstants.Pagination.PageSizeMustBeGreaterThanZero);
    }
}

public class EmailValidator : AbstractValidator<string>
{
    public EmailValidator()
    {
        RuleFor(email => email)
            .NotEmpty().WithErrorCode(ErrorCodeConstants.Email.EmailCannotBeEmpty)
            .Matches(RegexPatterns.EmailRegex).WithErrorCode(ErrorCodeConstants.Email.EmailInvalid)
            .WithName("Email");
    }
}