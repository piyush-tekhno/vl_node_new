import { useTheme } from "@/src/constants/theme"; // Import the useTheme hook
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DarkColors, LightColors } from "../../../constants/Colors";
import { useRouter } from "expo-router";

const VisitorLogDashboard = () => {
  const { theme, colors } = useTheme(); // Get the current theme and colors
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [refreshing, setRefreshing] = useState(false);
  const [stats] = useState({
    today: 12,
    week: 84,
    month: 245,
    year: 2890,
    weeklyData: [15, 22, 18, 25, 20, 28, 19],
    monthlyData: [45, 52, 48, 65, 72, 68, 80, 78, 85, 65, 72, 90],
    dailyData: [5, 7, 6, 8, 4, 9, 10],
    categoryData: [
      { name: "Delivery", count: 45, color: colors.error },
      { name: "Meeting", count: 78, color: colors.accent },
      { name: "Interview", count: 32, color: colors.warning },
      { name: "Maintenance", count: 23, color: colors.primary },
      { name: "Other", count: 67, color: colors.secondary },
    ],
  });

  const [recentVisitors] = useState([
    {
      id: 1,
      name: "John Smith",
      company: "ABC Corp",
      time: "09:30 AM",
      purpose: "Meeting",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "XYZ Ltd",
      time: "10:15 AM",
      purpose: "Delivery",
    },
    {
      id: 3,
      name: "Michael Brown",
      company: "Tech Solutions",
      time: "11:05 AM",
      purpose: "Interview",
    },
    {
      id: 4,
      name: "Emily Davis",
      company: "Global Inc",
      time: "01:20 PM",
      purpose: "Meeting",
    },
    {
      id: 5,
      name: "David Wilson",
      company: "Service Pro",
      time: "02:45 PM",
      purpose: "Maintenance",
    },
  ]);

  const [complaints] = useState([
    { id: 1, person: "Alice Johnson", complaint: "Slow service at reception" },
    { id: 2, person: "Mark Evans", complaint: "Visitor badge not working" },
    { id: 3, person: "Sophia Lee", complaint: "Long waiting time" },
  ]);
  //ROUTERS
  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Helper function to render bar chart
  const renderBarChart = (data, labels) => {
    const maxValue = Math.max(...data);

    return (
      <View style={styles.chartContainer}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barLabelContainer}>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                {labels[index]}
              </Text>
            </View>
            <View
              style={[
                styles.barBackground,
                {
                  backgroundColor:
                    theme === "light" ? LightColors.border : DarkColors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(value / maxValue) * 80}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: colors.textPrimary }]}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Helper function to render category chart
  const renderCategoryChart = (data) => {
    return (
      <View style={styles.categoryContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={[styles.categoryText, { color: colors.textPrimary }]}>
              {item.name}: {item.count}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <ScrollView
        style={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/DashCount",
                  params: { period: "today", count: stats.today },
                })
              }
            >
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {stats.today}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                Today
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/DashCount",
                  params: { period: "week", count: stats.week },
                })
              }
            >
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {stats.week}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                This Week
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/DashCount",
                  params: { period: "month", count: stats.month },
                })
              }
            >
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {stats.month}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                This Month
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/DashCount",
                  params: { period: "year", count: stats.year },
                })
              }
            >
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {stats.year}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                This Year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  theme === "light" ? LightColors.border : DarkColors.border,
              },
              selectedPeriod === "today" && [
                styles.periodButtonActive,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedPeriod("today")}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: colors.textSecondary },
                selectedPeriod === "today" && [
                  styles.periodButtonTextActive,
                  { color: colors.surface },
                ],
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  theme === "light" ? LightColors.border : DarkColors.border,
              },
              selectedPeriod === "week" && [
                styles.periodButtonActive,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: colors.textSecondary },
                selectedPeriod === "week" && [
                  styles.periodButtonTextActive,
                  { color: colors.surface },
                ],
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  theme === "light" ? LightColors.border : DarkColors.border,
              },
              selectedPeriod === "month" && [
                styles.periodButtonActive,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: colors.textSecondary },
                selectedPeriod === "month" && [
                  styles.periodButtonTextActive,
                  { color: colors.surface },
                ],
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  theme === "light" ? LightColors.border : DarkColors.border,
              },
              selectedPeriod === "year" && [
                styles.periodButtonActive,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedPeriod("year")}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: colors.textSecondary },
                selectedPeriod === "year" && [
                  styles.periodButtonTextActive,
                  { color: colors.surface },
                ],
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
        {/* Charts Section */}
        <View
          style={[
            styles.chartsContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.textPrimary,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Visitor Trends
          </Text>

          {selectedPeriod === "today" && (
            <View style={styles.chartWrapper}>
              <Text
                style={[styles.chartTitle, { color: colors.textSecondary }]}
              >
                Today's Visitors by Hour
              </Text>
              {renderBarChart(stats.dailyData, [
                "9AM",
                "10AM",
                "11AM",
                "12PM",
                "1PM",
                "2PM",
                "3PM",
              ])}
            </View>
          )}

          {selectedPeriod === "week" && (
            <View style={styles.chartWrapper}>
              <Text
                style={[styles.chartTitle, { color: colors.textSecondary }]}
              >
                Weekly Visitors
              </Text>
              {renderBarChart(stats.weeklyData, [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ])}
            </View>
          )}

          {selectedPeriod === "month" && (
            <View style={styles.chartWrapper}>
              <Text
                style={[styles.chartTitle, { color: colors.textSecondary }]}
              >
                Monthly Visitors
              </Text>
              {renderBarChart(stats.monthlyData, [
                "J",
                "F",
                "M",
                "A",
                "M",
                "J",
                "J",
                "A",
                "S",
                "O",
                "N",
                "D",
              ])}
            </View>
          )}

          {selectedPeriod === "year" && (
            <View style={styles.chartWrapper}>
              <Text
                style={[styles.chartTitle, { color: colors.textSecondary }]}
              >
                Visitors by Category
              </Text>
              {renderCategoryChart(stats.categoryData)}
            </View>
          )}
        </View>

        {/* Recent Visitors */}
        <View
          style={[
            styles.recentContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.textPrimary,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recent Visitors
          </Text>
          {recentVisitors.map((visitor) => (
            <View
              key={visitor.id}
              style={[styles.visitorCard, { borderBottomColor: colors.border }]}
            >
              <View style={styles.visitorInfo}>
                <Text
                  style={[styles.visitorName, { color: colors.textPrimary }]}
                >
                  {visitor.name}
                </Text>
                <Text
                  style={[
                    styles.visitorCompany,
                    { color: colors.textSecondary },
                  ]}
                >
                  {visitor.company}
                </Text>
              </View>
              <View style={styles.visitorDetails}>
                <Text
                  style={[styles.visitorTime, { color: colors.textSecondary }]}
                >
                  {visitor.time}
                </Text>
                <View
                  style={[
                    styles.purposeBadge,
                    {
                      backgroundColor: getPurposeColor(visitor.purpose, colors),
                    },
                  ]}
                >
                  <Text style={styles.purposeText}>{visitor.purpose}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.complaintsContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.textPrimary,
            },
          ]}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Complaints
            </Text>

            <TouchableOpacity onPress={() => router.push("/Complaints")}>
              <Text
                style={[{ fontWeight: 400 }, { color: colors.textPrimary }]}
              >
                Seel All
              </Text>
            </TouchableOpacity>
          </View>

          {complaints.map((c) => (
            <View
              key={c.id}
              style={[
                styles.complaintCard,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text
                style={[styles.complaintPerson, { color: colors.textPrimary }]}
              >
                👤 {c.person}
              </Text>
              <Text
                style={[styles.complaintText, { color: colors.textSecondary }]}
              >
                {c.complaint}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to get color based on purpose
const getPurposeColor = (purpose, colors) => {
  switch (purpose) {
    case "Meeting":
      return colors.accent;
    case "Delivery":
      return colors.error;
    case "Interview":
      return colors.warning;
    case "Maintenance":
      return colors.primary;
    default:
      return colors.secondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  periodButtonActive: {},
  periodButtonText: {
    fontWeight: "500",
    fontSize: 14,
  },
  periodButtonTextActive: {},
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    // marginBottom: 8,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  chartsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    alignSelf: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
    width: "100%",
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    height: "100%",
  },
  barLabelContainer: {
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 12,
  },
  barBackground: {
    width: 20,
    height: "80%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  barValue: {
    marginTop: 5,
    fontSize: 12,
  },
  categoryContainer: {
    width: "100%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  recentContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  visitorCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  visitorCompany: {
    fontSize: 14,
  },
  visitorDetails: {
    alignItems: "flex-end",
  },
  visitorTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  purposeText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },

  //compaints styling
  complaintsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  complaintCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  complaintPerson: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  complaintText: {
    fontSize: 14,
  },
});

export default VisitorLogDashboard;
