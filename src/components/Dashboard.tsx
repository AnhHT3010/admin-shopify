import { Button, Card, DatePicker, Popover, Text } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface DateRange {
  start: Date;
  end: Date;
}
interface MonthRange {
  month: number;
  year: number;
}

const Dashboard = () => {
  const allSubscriptionData = {
    labels: [
      "1/10/2024",
      "2/10/2024",
      "3/10/2024",
      "4/10/2024",
      "5/10/2024",
      "6/10/2024",
      "7/10/2024",
    ],
    datasets: [
      {
        label: "Dataset",
        data: [50, 100, 80, 20, 0, 30, 70],
        fill: false,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "#FBB4C2",
        tension: 0.1,
      },
    ],
  };

  const revenueData = {
    labels: [
      "1/10/2024",
      "2/10/2024",
      "3/10/2024",
      "4/10/2024",
      "5/10/2024",
      "6/10/2024",
      "7/10/2024",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [500, 650, 300, 400, 500, 600, 700],
        backgroundColor: "#FBB4C2",
        borderColor: "#FBB4C2",
        borderWidth: 1,
      },
    ],
  };
  const [subscriptionData, setSubscriptionData] = useState(allSubscriptionData);
  const [popoverActive, setPopoverActive] = useState<boolean>(false);
  const [{ month, year }, setDate] = useState<MonthRange>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    start: new Date(2024, 9, 1),
    end: new Date(2024, 9, 7),
  });
  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  const handleDateChange = (value: DateRange) => setSelectedDates(value);
  const togglePopover = () =>
    setPopoverActive((popoverActive) => !popoverActive);

  // Tính tổng data chỉ khi selectedDates thay đổi
  const totalSubscription = useMemo(() => {
    return subscriptionData.datasets[0].data.reduce(
      (total, value) => total + value,
      0
    );
  }, [subscriptionData.datasets]);

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    const { start, end } = selectedDates;
    const filteredLabels = allSubscriptionData.labels.filter((label) => {
      const date = parseDate(label);
      return date >= start && date <= end;
    });

    const filteredData = allSubscriptionData.datasets[0].data.filter(
      (_, index) => {
        const date = parseDate(allSubscriptionData.labels[index]);
        return date >= start && date <= end;
      }
    );

    setSubscriptionData({
      labels: filteredLabels,
      datasets: [
        {
          ...allSubscriptionData.datasets[0],
          data: filteredData,
        },
      ],
    });
  }, [selectedDates, allSubscriptionData.datasets, allSubscriptionData.labels]);
  return (
    <div className="px-9">
      <div className="text-2xl font-bold pb-8">Dashboard</div>
      <Popover
        active={popoverActive}
        activator={
          <Button icon={CalendarIcon} onClick={togglePopover}>
            Lọc theo ngày
          </Button>
        }
        onClose={togglePopover}
      >
        <Card>
          <DatePicker
            month={month}
            year={year}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            allowRange
          />
        </Card>
      </Popover>
      <div className="flex flex-col md:flex-row md:gap-9 mt-3">
        <div className="w-1/2">
          <Card>
            <Text variant="headingMd" as="h3">
              Subscription
            </Text>
            <Text variant="headingXl" as="h2">
              {totalSubscription}
            </Text>
            <Line data={subscriptionData} />
          </Card>
        </div>
        <div className="w-1/2">
          <Card>
            <Text variant="headingMd" as="h3">
              Revenue
            </Text>
            <Text variant="headingXl" as="h2">
              $3040
            </Text>
            <Bar data={revenueData} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
