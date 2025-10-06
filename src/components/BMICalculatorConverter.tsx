import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Calculator, Copy, RefreshCcw, Scale, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { formatNumber } from "../lib/format";

type BMICategory = {
  name: string;
  range: string;
  color: string;
  icon: any;
  description: string;
};

const BMI_CATEGORIES: BMICategory[] = [
  { 
    name: "Underweight", 
    range: "< 18.5", 
    color: "text-blue-600", 
    icon: AlertTriangle,
    description: "May indicate malnutrition, eating disorder, or other health issues"
  },
  { 
    name: "Normal Weight", 
    range: "18.5 - 24.9", 
    color: "text-green-600", 
    icon: CheckCircle,
    description: "Indicates healthy weight for most adults"
  },
  { 
    name: "Overweight", 
    range: "25.0 - 29.9", 
    color: "text-yellow-600", 
    icon: AlertTriangle,
    description: "May increase risk of health problems"
  },
  { 
    name: "Obese (Class I)", 
    range: "30.0 - 34.9", 
    color: "text-orange-600", 
    icon: AlertTriangle,
    description: "Significantly increased risk of health problems"
  },
  { 
    name: "Obese (Class II)", 
    range: "35.0 - 39.9", 
    color: "text-red-600", 
    icon: AlertTriangle,
    description: "Severely increased risk of health problems"
  },
  { 
    name: "Obese (Class III)", 
    range: "≥ 40.0", 
    color: "text-red-800", 
    icon: AlertTriangle,
    description: "Very severely increased risk of health problems"
  }
];

export function BMICalculatorConverter() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("unspecified");

  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (!weightValue || !heightValue || weightValue <= 0 || heightValue <= 0) {
      return { bmi: 0, category: null, isValid: false };
    }

    // Convert weight to kg
    let weightKg = weightValue;
    if (weightUnit === "lb") {
      weightKg = weightValue * 0.453592;
    }

    // Convert height to meters
    let heightM = heightValue;
    if (heightUnit === "cm") {
      heightM = heightValue / 100;
    } else if (heightUnit === "ft") {
      heightM = heightValue * 0.3048;
    } else if (heightUnit === "in") {
      heightM = heightValue * 0.0254;
    }

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);
    
    // Determine category
    let category = BMI_CATEGORIES[0]; // Default to underweight
    if (bmi >= 18.5 && bmi < 25) category = BMI_CATEGORIES[1];
    else if (bmi >= 25 && bmi < 30) category = BMI_CATEGORIES[2];
    else if (bmi >= 30 && bmi < 35) category = BMI_CATEGORIES[3];
    else if (bmi >= 35 && bmi < 40) category = BMI_CATEGORIES[4];
    else if (bmi >= 40) category = BMI_CATEGORIES[5];

    return { bmi, category, isValid: true };
  };

  const result = calculateBMI();

  const reset = () => {
    setWeight("70");
    setHeight("170");
    setWeightUnit("kg");
    setHeightUnit("cm");
    setAge("25");
    setGender("unspecified");
  };

  const copyResult = async () => {
    if (!result.isValid || !result.category) return;

    const text = `BMI Calculation Results:

Weight: ${weight} ${weightUnit}
Height: ${height} ${heightUnit}
${age ? `Age: ${age}` : ''}
${gender !== 'unspecified' ? `Gender: ${gender}` : ''}

BMI: ${formatNumber(result.bmi)}
Category: ${result.category.name} (${result.category.range})

${result.category.description}

Note: BMI is a screening tool and may not reflect body fat distribution or muscle mass. Consult healthcare providers for complete health assessment.`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">BMI Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate Body Mass Index from height and weight with health categories
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="size-5" />
              Body Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Unit</Label>
                <Select value={weightUnit} onValueChange={setWeightUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Height */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heightUnit">Unit</Label>
                <Select value={heightUnit} onValueChange={setHeightUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                    <SelectItem value="ft">Feet (ft)</SelectItem>
                    <SelectItem value="in">Inches (in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Optional Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Optional Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unspecified">Not specified</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1 cursor-pointer">
                <RefreshCcw className="mr-2 size-4" />
                Reset
              </Button>
              <Button onClick={copyResult} variant="outline" disabled={!result.isValid} className="cursor-pointer">
                <Copy className="mr-2 size-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              BMI Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.isValid && result.category ? (
              <>
                {/* BMI Value */}
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {formatNumber(result.bmi)}
                  </div>
                  <div className="text-lg font-medium">Body Mass Index</div>
                </div>

                <Separator />

                {/* Category */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <result.category.icon className={`size-5 ${result.category.color}`} />
                    <span className={`text-lg font-semibold ${result.category.color}`}>
                      {result.category.name}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Range: {result.category.range}
                    </div>
                    <div className="text-sm">
                      {result.category.description}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* All Categories Reference */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">BMI Categories (WHO)</h4>
                  <div className="space-y-1">
                    {BMI_CATEGORIES.map((cat, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between text-xs p-2 rounded ${
                          cat.name === result.category?.name ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <cat.icon className={`size-3 ${cat.color}`} />
                          <span className={cat.color}>{cat.name}</span>
                        </div>
                        <span className="text-muted-foreground">{cat.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-8">
                <Calculator className="size-12 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <div className="text-lg font-medium text-muted-foreground">
                    Enter your measurements
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Provide valid weight and height to calculate BMI
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Important:</strong> BMI is a screening tool and may not directly correlate with body fat or health status in athletes, elderly, or those with high muscle mass.</p>
              <p>For comprehensive health assessment, consult with healthcare professionals.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}