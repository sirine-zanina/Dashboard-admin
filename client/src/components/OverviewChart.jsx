import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const [data, isLoading] = useGetSalesQuery();

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    const { monthlyData } = data;
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };
    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        const currentSales = acc.sales + totalSales;
        const currentUnits = acc.units + totalUnits;

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: month, y: currentSales },
        ];
      },
      { sales: 0, units: 0 }
    );
  }, [data]);

  return <div>OverviewChart</div>;
};

export default OverviewChart;
