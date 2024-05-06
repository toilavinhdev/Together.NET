using FluentValidation;
using Together.Shared.Constants;
using Together.Shared.ValueObjects;

namespace Together.Shared.Helpers;

public class PaginationValidator : AbstractValidator<IPaginationRequest>
{
    public PaginationValidator()
    {
        RuleFor(x => x.PageIndex)
            .NotNull().WithErrorCode("PAGE_INDEX_CANNOT_BE_NULL")
            .GreaterThan(0).WithErrorCode("PAGE_INDEX_MUST_BE_GREATER_THAN_0");
        RuleFor(x => x.PageSize)
            .NotNull().WithErrorCode("PAGE_SIZE_CANNOT_BE_NULL")
            .GreaterThan(0).WithErrorCode("PAGE_SIZE_MUST_BE_GREATER_THAN_0");
    }
}

public class EmailValidator : AbstractValidator<string>
{
    public EmailValidator()
    {
        RuleFor(email => email)
            .NotEmpty().WithErrorCode("EMAIL_CANNOT_BE_EMPTY")
            .Matches(RegexPatterns.EmailRegex).WithErrorCode("EMAIL_INVALID")
            .WithName("Email");
    }
}