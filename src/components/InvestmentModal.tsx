import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  project: {
    _id: string;
    title: string;
    minInvestment: number;
    roiPercent: number;
    targetAmount: number;
    fundedAmount: number;
    durationMonths: number;
  };
  onSuccess?: () => void;
}

export default function InvestmentModal({
  open,
  onClose,
  project,
  onSuccess,
}: InvestmentModalProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [amount, setAmount] = useState(project.minInvestment.toString());
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const investmentAmount = parseFloat(amount) || 0;
  const expectedReturn = investmentAmount + (investmentAmount * project.roiPercent) / 100;
  const remainingFunding = project.targetAmount - project.fundedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate authentication
    if (!user) {
      toast.error('Please login to invest');
      navigate('/login');
      return;
    }

    // Validate amount
    if (investmentAmount < project.minInvestment) {
      toast.error(`Minimum investment is ${formatCurrency(project.minInvestment)}`);
      return;
    }

    if (investmentAmount > remainingFunding) {
      toast.error(
        `Investment amount exceeds remaining target. Maximum: ${formatCurrency(remainingFunding)}`
      );
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/investments', {
        projectId: project._id,
        amount: investmentAmount,
        paymentMethod,
      });

      toast.success('Investment successful!');
      onClose();

      // Call success callback to refresh project data
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to investment details or my investments
      if (response.data.data.investment._id) {
        toast.info('Redirecting to your investments...');
        setTimeout(() => {
          navigate('/my-investments');
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Investment failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invest in {project.title}</DialogTitle>
          <DialogDescription>
            Enter your investment amount and payment details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={project.minInvestment}
                max={remainingFunding}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                placeholder={project.minInvestment.toString()}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Min: {formatCurrency(project.minInvestment)} | Max: {formatCurrency(remainingFunding)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Investment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm">Investment Summary</h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  Investment Amount
                </span>
                <span className="font-semibold">{formatCurrency(investmentAmount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  ROI ({project.roiPercent}%)
                </span>
                <span className="font-semibold text-green-600">
                  +{formatCurrency((investmentAmount * project.roiPercent) / 100)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Duration
                </span>
                <span className="font-semibold">{project.durationMonths} months</span>
              </div>

              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Expected Return</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(expectedReturn)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms Notice */}
          <p className="text-xs text-gray-500 leading-relaxed">
            By investing, you agree to our terms and conditions. All investments are subject to risk.
            You can cancel your investment within 24 hours of placement.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : `Invest ${formatCurrency(investmentAmount)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
