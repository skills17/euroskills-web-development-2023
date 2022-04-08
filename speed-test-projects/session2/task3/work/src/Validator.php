<?php

namespace EuroSkills\Trade17\Validator;

class Validator {
    /**
     * Validates if an input starts with the specified string.
     *
     * The validation is performed case-insensitive.
     *
     * @param   string  $input  The input data
     * @param   string  $start  String with which the input has to start to pass the validation
     * @return  boolean         True if the input data passes the validation, false otherwise
     */
    public function startsWithCaseInsensitive(string $input, string $start): bool
    {
        return false;
    }

    /**
     * Validates if the provided value is in the specified range.
     *
     * If the input is a string, the string length is checked.
     * If the input is a number, the numeric value is checked.
     *
     * The check is inclusive, meaning the validation also passes if the value lies exactly on the min or max value.
     *
     * @param   mixed   $input  The input data
     * @param   int     $min    Minimum length or value
     * @param   int     $max    Maximum length or value
     * @return  boolean         True if the input data passes the validation, false otherwise
     */
    public function between($input, int $min, int $max): bool
    {
        return false;
    }

    /**
     * Validates if the provided string is a valid date and after the provided one.
     * If the input date is not a valid date, the validation fails.
     *
     * The check is exclusive, meaning the validation fails if the value lies exactly on the after date.
     *
     * The dates are passed in ISO 8601 format, for example: 2021-09-28
     *
     * @param   string  $input  The input date in ISO 8601 format
     * @param   string  $after  Date after which the input date has to be to pass the validation
     * @return  boolean         True if the input data passes the validation, false otherwise
     */
    public function dateAfter(string $input, string $after): bool
    {
        return false;
    }
}
