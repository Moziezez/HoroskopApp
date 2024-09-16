import { describe, test, it, expect } from "vitest";
import { userInput } from "../assets/func";

describe('userInput', () => {
    var params = {
        name: "Maurice",
        date: "23.04.1994",
        hour: "16",
        minu: "05",
        longi: "52.5",
        lati: "13.6",
        house: "placidus",
        loca: "Hannover"+"Germany",
        zodi: true,
        check: true,
        aspectChecks: [1,1,1,1,0,0,0,1,1,1],
      };

    it('should be dfeined for valid inputs', () => {
        expect(userInput(params)).toBeDefined();
    });

})
