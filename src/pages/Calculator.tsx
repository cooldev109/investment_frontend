import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import api from '../lib/api';
import { DollarSign, TrendingUp, Calendar, Calculator as CalcIcon } from 'lucide-react';

interface SimulationResult {
  input: {
    amount: number;
    roiPercent: number;
    durationMonths: number;
  };
  results: {
    initialInvestment: number;
    totalReturn: number;
    profit: number;
    profitPercentage: number;
    expectedReturnDate: string;
  };
  monthlyBreakdown: Array<{
    month: number;
    value: number;
    profit: number;
  }>;
  statistics: {
    monthlyProfit: number;
    dailyProfit: number;
    annualizedReturn: number;
  };
}

export default function Calculator() {
  const [amount, setAmount] = useState('10000');
  const [roiPercent, setRoiPercent] = useState('15');
  const [durationMonths, setDurationMonths] = useState('12');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    const investmentAmount = parseFloat(amount);
    const roi = parseFloat(roiPercent);
    const duration = parseInt(durationMonths);

    // Validation
    if (!investmentAmount || investmentAmount <= 0) {
      toast.error('Please enter a valid investment amount');
      return;
    }

    if (!roi || roi < 0) {
      toast.error('Please enter a valid ROI percentage');
      return;
    }

    if (!duration || duration < 1) {
      toast.error('Please enter a valid duration');
      return;
    }

    setIsCalculating(true);

    try {
      const response = await api.post('/simulation', {
        amount: investmentAmount,
        roiPercent: roi,
        durationMonths: duration,
      });

      setResult(response.data.data);
      toast.success('Calculation completed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Calculation failed');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
              <CalcIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">ROI Calculator</h1>
            <p className="text-gray-600 text-lg">
              Calculate your potential investment returns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
                <CardDescription>
                  Enter your investment parameters to calculate potential returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-6">
                  {/* Investment Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="100"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                        placeholder="10000"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      How much do you want to invest?
                    </p>
                  </div>

                  {/* ROI Percentage */}
                  <div className="space-y-2">
                    <Label htmlFor="roi">Expected ROI (%)</Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="roi"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1000"
                        value={roiPercent}
                        onChange={(e) => setRoiPercent(e.target.value)}
                        className="pl-10"
                        placeholder="15"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      The expected return percentage
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Investment Duration (Months)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="120"
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(e.target.value)}
                        className="pl-10"
                        placeholder="12"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      How long will you invest for?
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCalculating}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate Returns'}
                  </Button>
                </form>

                {/* Quick Presets */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium mb-3">Quick Presets:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAmount('5000');
                        setRoiPercent('12');
                        setDurationMonths('12');
                      }}
                    >
                      Conservative
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAmount('10000');
                        setRoiPercent('15');
                        setDurationMonths('12');
                      }}
                    >
                      Moderate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAmount('20000');
                        setRoiPercent('20');
                        setDurationMonths('18');
                      }}
                    >
                      Aggressive
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAmount('50000');
                        setRoiPercent('25');
                        setDurationMonths('24');
                      }}
                    >
                      Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>
                  {result ? 'Your projected investment returns' : 'Results will appear here after calculation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Initial Investment</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(result.results.initialInvestment)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">Total Return</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(result.results.totalReturn)}
                        </p>
                      </div>
                    </div>

                    {/* Profit Highlight */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white">
                      <p className="text-sm font-medium mb-2">Your Profit</p>
                      <p className="text-4xl font-bold mb-2">
                        {formatCurrency(result.results.profit)}
                      </p>
                      <p className="text-sm opacity-90">
                        +{result.results.profitPercentage}% return in {result.input.durationMonths} months
                      </p>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Monthly Profit</span>
                        <span className="font-semibold">{formatCurrency(result.statistics.monthlyProfit)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Daily Profit</span>
                        <span className="font-semibold">{formatCurrency(result.statistics.dailyProfit)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Annualized Return</span>
                        <span className="font-semibold text-green-600">{result.statistics.annualizedReturn}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Expected Return Date</span>
                        <span className="font-semibold text-sm">{formatDate(result.results.expectedReturnDate)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalcIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter your investment details and click "Calculate Returns" to see your projected returns
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Growth Chart */}
          {result && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Investment Growth Over Time</CardTitle>
                <CardDescription>
                  Visualize how your investment grows month by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={result.monthlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Investment Value"
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Profit"
                      dot={{ fill: '#10b981', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Start Investing?</h3>
                <p className="text-gray-600 mb-6">
                  Browse our curated investment projects and start building your portfolio today
                </p>
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/projects'}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Browse Investment Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
