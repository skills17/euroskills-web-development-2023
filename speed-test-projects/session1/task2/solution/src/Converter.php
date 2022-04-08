<?php

namespace EuroSkills\Trade17\Converter;

class Converter {
    /**
     * Convert a CSV string into a JSON string.
     * The first line of the CSV acts as a header and should be used for the keys in the JSON result.
     * It can be assumed that all CSV values are strings so no type conversion is required.
     *
     * Example:
     *
     * id,language,posts
     * 1,php,1411524
     * 2,javascript,2255740
     *
     * Results in:
     * [
     *   {
     *     "id": "1",
     *     "language": "php",
     *     "posts": "1411524"
     *   },
     *   {
     *     "id": "2",
     *     "language": "javascript",
     *     "posts": "2255740"
     *   }
     * ]
     *
     * @param string $csv Input CSV as a string
     * @return string Resulting JSON as a string
     */
    public function csvToJson(string $csv): string {
        $json = [];
        $parsed = array_map('str_getcsv', explode("\n", trim($csv)));

        for ($i = 1; $i < count($parsed); $i++) {
            $json[] = array_combine($parsed[0], $parsed[$i]);
        }

        return json_encode($json);
    }
}
