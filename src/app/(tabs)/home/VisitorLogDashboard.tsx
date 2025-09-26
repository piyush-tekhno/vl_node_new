// import { useTheme } from "@/src/constants/theme";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   RefreshControl,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { DarkColors, LightColors } from "../../../constants/Colors";
// import { useRouter } from "expo-router";
// import { useAuth } from "@/src/context/AuthContext";
// import { getAllComplaints } from "@/src/api/complaints/getAllComplaints";
// import { visitorService, Visitor, DashboardStats } from "@/src/api/Home/HomeCount";

// interface Complaint {
//   complaint_id: number;
//   dept_id: number;
//   complainer_name: string;
//   complainer_mobile: string;
//   complainer_city: string;
//   complaint_reason: string;
//   status: "pending" | "resolved";
//   resolved_by: number | null;
//   resolved_at: string | null;
//   created_at: string;
// }

// const VisitorLogDashboard = () => {
//   const { theme, colors } = useTheme();
//   const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">("today");
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState<DashboardStats>({
//     today: 0,
//     week: 0,
//     month: 0,
//     year: 0,
//     todayData: [],
//     weekData: [],
//     monthData: [],
//     yearData: []
//   });

//   const [chartData, setChartData] = useState({
//   weeklyData: [0, 0, 0, 0, 0, 0, 0],
//   weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//   monthlyData: Array(31).fill(0),
//   dailyData: Array(15).fill(0), // 6AM to 8PM (15 hours)
//   dailyLabels: Array.from({length: 15}, (_, i) => {
//     const hour = 6 + i;
//     return hour <= 12 ? `${hour}AM` : `${hour - 12}PM`;
//   }),
//   categoryData: [
//     { name: "Delivery", count: 0, color: colors.error },
//     { name: "Meeting", count: 0, color: colors.accent },
//     { name: "Interview", count: 0, color: colors.warning },
//     { name: "Maintenance", count: 0, color: colors.info },
//     { name: "Personal", count: 0, color: colors.primary },
//     { name: "Casual", count: 0, color: colors.secondary },
//     { name: "Other", count: 0, color: colors.textTertiary },
//   ],
// });

//   const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
//   const [resolvedComplaints, setResolvedComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const router = useRouter();
//   const { token } = useAuth();

//   // Process visitor data for charts
//  // Process visitor data for charts using created_at field
// const processVisitorData = useCallback((visitors: Visitor[]) => {
//   // Process for daily data (by hour) - using created_at for accurate timing
//   const hourlyData = Array(24).fill(0); // 24 hours for full day coverage
  
//   // Process for weekly data (by day of week)
//   const weeklyData = Array(7).fill(0); // Sunday to Saturday
  
//   // Process for monthly data (by day of month)
//   const monthlyData = Array(31).fill(0); // Days 1-31
  
//   // Process for categories
//   const categoryCounts: { [key: string]: number } = {
//     "Delivery": 0,
//     "Meeting": 0,
//     "Interview": 0,
//     "Maintenance": 0,
//     "Personal": 0,
//     "Casual": 0,
//     "Other": 0
//   };

//   visitors.forEach(visitor => {
//     // Categorize by reason - using more specific categories based on your API data
//     const reason = visitor.reason.toLowerCase();
//     if (reason.includes('delivery')) categoryCounts["Delivery"]++;
//     else if (reason.includes('meeting')) categoryCounts["Meeting"]++;
//     else if (reason.includes('interview')) categoryCounts["Interview"]++;
//     else if (reason.includes('maintenance')) categoryCounts["Maintenance"]++;
//     else if (reason.includes('personal')) categoryCounts["Personal"]++;
//     else if (reason.includes('casual')) categoryCounts["Casual"]++;
//     else categoryCounts["Other"]++;

//     // Process time for hourly data using created_at (actual log time)
//     if (visitor.created_at) {
//       const createdTime = new Date(visitor.created_at);
      
//       // Hourly data (0-23)
//       const hour = createdTime.getHours();
//       hourlyData[hour]++;
      
//       // Weekly data (0=Sunday, 6=Saturday)
//       const dayOfWeek = createdTime.getDay();
//       weeklyData[dayOfWeek]++;
      
//       // Monthly data (1-31)
//       const dayOfMonth = createdTime.getDate() - 1; // Convert to 0-based index
//       if (dayOfMonth >= 0 && dayOfMonth < 31) {
//         monthlyData[dayOfMonth]++;
//       }
//     }
//   });

//   // For daily chart, show only relevant hours (e.g., 6AM to 8PM)
//   const startHour = 6; // 6AM
//   const endHour = 20;  // 8PM
//   const relevantDailyData = hourlyData.slice(startHour, endHour + 1);
//   const dailyLabels = Array.from({length: endHour - startHour + 1}, (_, i) => {
//     const hour = startHour + i;
//     return hour <= 12 ? `${hour}AM` : `${hour - 12}PM`;
//   });

//   // For weekly chart, organize from Monday to Sunday
//   const reorderedWeeklyData = [
//     ...weeklyData.slice(1), // Monday to Saturday
//     weeklyData[0] // Sunday
//   ];
//   const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   // For monthly chart, show only days that have data
//   const daysWithData = monthlyData.map((count, index) => ({ day: index + 1, count }));
//   const filteredMonthlyData = daysWithData.filter(day => day.count > 0);
  
//   setChartData(prev => ({
//     ...prev,
//     dailyData: relevantDailyData,
//     dailyLabels: dailyLabels,
//     weeklyData: reorderedWeeklyData,
//     weeklyLabels: weeklyLabels,
//     monthlyData: monthlyData.slice(0, new Date().getDate()), // Only show up to current day
//     categoryData: [
//       { name: "Delivery", count: categoryCounts["Delivery"], color: colors.error },
//       { name: "Meeting", count: categoryCounts["Meeting"], color: colors.accent },
//       { name: "Interview", count: categoryCounts["Interview"], color: colors.warning },
//       { name: "Maintenance", count: categoryCounts["Maintenance"], color: colors.info },
//       { name: "Personal", count: categoryCounts["Personal"], color: colors.primary },
//       { name: "Casual", count: categoryCounts["Casual"], color: colors.secondary },
//       { name: "Other", count: categoryCounts["Other"], color: colors.textTertiary },
//     ].filter(item => item.count > 0) // Only show categories that have data
//   }));
// });

 
// // Enhanced category chart with percentages
// const renderBarChart = (data: number[], labels: string[], maxBars: number = 12) => {
//   if (data.length === 0) {
//     return (
//       <View style={styles.noDataContainer}>
//         <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
//           No data available for this period
//         </Text>
//       </View>
//     );
//   }

//   const maxValue = Math.max(...data, 1);
//   const displayData = data.slice(0, maxBars);
//   const displayLabels = labels.slice(0, maxBars);

//   return (
//     <View style={styles.chartContainer}>
//       {displayData.map((value, index) => (
//         <View key={index} style={styles.barContainer}>
//           <View style={styles.barLabelContainer}>
//             <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
//               {displayLabels[index]}
//             </Text>
//           </View>
//           <View
//             style={[
//               styles.barBackground,
//               {
//                 backgroundColor:
//                   theme === "light" ? LightColors.border : DarkColors.border,
//               },
//             ]}
//           >
//             <View
//               style={[
//                 styles.bar,
//                 {
//                   height: `${(value / maxValue) * 80}%`,
//                   backgroundColor: colors.primary,
//                 },
//               ]}
//             />
//           </View>
//           <Text style={[styles.barValue, { color: colors.textPrimary }]}>
//             {value}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// // Enhanced category chart with percentages
// const renderCategoryChart = (data: typeof chartData.categoryData) => {
//   if (data.length === 0) {
//     return (
//       <View style={styles.noDataContainer}>
//         <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
//           No category data available
//         </Text>
//       </View>
//     );
//   }

//   const total = data.reduce((sum, item) => sum + item.count, 0);

//   return (
//     <View style={styles.categoryContainer}>
//       {data.map((item, index) => (
//         <View key={index} style={styles.categoryItem}>
//           <View style={[styles.colorBox, { backgroundColor: item.color }]} />
//           <View style={styles.categoryTextContainer}>
//             <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
//               {item.name}
//             </Text>
//             <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
//              {item.count} ({Math.round((item.count / total) * 100)}%)

//             </Text>
//           </View>
//         </View>
//       ))}
//     </View>
//   );
// };

//   // Fetch all data including visitor stats and complaints
//   const fetchAllData = async () => {
//     if (!token) {
//       setError("No authentication token available");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch visitor stats and complaints concurrently
//       const [dashboardStats, pendingData, resolvedData] = await Promise.all([
//         visitorService.getDashboardCounts(token),
//         getAllComplaints(token, "pending"),
//         getAllComplaints(token, "resolved"),
//       ]);

//       setStats(dashboardStats);
//       setPendingComplaints(pendingData || []);
//       setResolvedComplaints(resolvedData || []);

//       // Process data for current period
//       const currentData = getCurrentPeriodData(selectedPeriod, dashboardStats);
//       processVisitorData(currentData);

//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get data for current period
//   const getCurrentPeriodData = (period: string, statsData: DashboardStats): Visitor[] => {
//     switch (period) {
//       case "today": return statsData.todayData;
//       case "week": return statsData.weekData;
//       case "month": return statsData.monthData;
//       case "year": return statsData.yearData;
//       default: return [];
//     }
//   };

//   // Handle period change
//   const handlePeriodChange = (period: "today" | "week" | "month" | "year") => {
//     setSelectedPeriod(period);
//     const currentData = getCurrentPeriodData(period, stats);
//     processVisitorData(currentData);
//   };

//   // Initial data load
//   useEffect(() => {
//     fetchAllData();
//   }, [token]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchAllData();
//     setRefreshing(false);
//   };

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // Get recent complaints (last 3 pending complaints)
//   const recentComplaints = pendingComplaints.slice(0, 3);

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar
//         barStyle={theme === "light" ? "dark-content" : "light-content"}
//       />
//       <ScrollView
//         style={{ paddingVertical: 20 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//       >
//         {/* Summary Cards */}
//         <View style={styles.summaryContainer}>
//           <View
//             style={[
//               styles.summaryCard,
//               {
//                 backgroundColor: colors.surface,
//                 shadowColor: colors.textPrimary,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/(tabs)/home/DashCount",
//                   params: { 
//                     period: "today", 
//                     count: stats.today,
//                     data: JSON.stringify(stats.todayData)
//                   },
//                 })
//               }
//             >
//               <Text style={[styles.summaryNumber, { color: colors.primary }]}>
//                 {stats.today}
//               </Text>
//               <Text
//                 style={[styles.summaryLabel, { color: colors.textSecondary }]}
//               >
//                 Today
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View
//             style={[
//               styles.summaryCard,
//               {
//                 backgroundColor: colors.surface,
//                 shadowColor: colors.textPrimary,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/(tabs)/home/DashCount",
//                   params: { 
//                     period: "week", 
//                     count: stats.week,
//                     data: JSON.stringify(stats.weekData)
//                   },
//                 })
//               }
//             >
//               <Text style={[styles.summaryNumber, { color: colors.primary }]}>
//                 {stats.week}
//               </Text>
//               <Text
//                 style={[styles.summaryLabel, { color: colors.textSecondary }]}
//               >
//                 This Week
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View
//             style={[
//               styles.summaryCard,
//               {
//                 backgroundColor: colors.surface,
//                 shadowColor: colors.textPrimary,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/(tabs)/home/DashCount",
//                   params: { 
//                     period: "month", 
//                     count: stats.month,
//                     data: JSON.stringify(stats.monthData)
//                   },
//                 })
//               }
//             >
//               <Text style={[styles.summaryNumber, { color: colors.primary }]}>
//                 {stats.month}
//               </Text>
//               <Text
//                 style={[styles.summaryLabel, { color: colors.textSecondary }]}
//               >
//                 This Month
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View
//             style={[
//               styles.summaryCard,
//               {
//                 backgroundColor: colors.surface,
//                 shadowColor: colors.textPrimary,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/(tabs)/home/DashCount",
//                   params: { 
//                     period: "year", 
//                     count: stats.year,
//                     data: JSON.stringify(stats.yearData)
//                   },
//                 })
//               }
//             >
//               <Text style={[styles.summaryNumber, { color: colors.primary }]}>
//                 {stats.year}
//               </Text>
//               <Text
//                 style={[styles.summaryLabel, { color: colors.textSecondary }]}
//               >
//                 This Year
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Period Selector */}
//         <View style={styles.periodSelector}>
//           {(["today", "week", "month", "year"] as const).map((period) => (
//             <TouchableOpacity
//               key={period}
//               style={[
//                 styles.periodButton,
//                 {
//                   backgroundColor:
//                     theme === "light" ? LightColors.border : DarkColors.border,
//                 },
//                 selectedPeriod === period && [
//                   styles.periodButtonActive,
//                   { backgroundColor: colors.primary },
//                 ],
//               ]}
//               onPress={() => handlePeriodChange(period)}
//             >
//               <Text
//                 style={[
//                   styles.periodButtonText,
//                   { color: colors.textSecondary },
//                   selectedPeriod === period && [
//                     styles.periodButtonTextActive,
//                     { color: colors.surface },
//                   ],
//                 ]}
//               >
//                 {period.charAt(0).toUpperCase() + period.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Charts Section */}
// {/* Charts Section */}
// <View
//   style={[
//     styles.chartsContainer,
//     {
//       backgroundColor: colors.surface,
//       shadowColor: colors.textPrimary,
//     },
//   ]}
// >
//   <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
//     Visitor Trends
//   </Text>

//   {selectedPeriod === "today" && (
//     <View style={styles.chartWrapper}>
//       <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
//         Today's Visitors by Hour (Based on Log Time)
//       </Text>
//       {renderBarChart(chartData.dailyData, chartData.dailyLabels || [])}
//     </View>
//   )}

//   {selectedPeriod === "week" && (
//     <View style={styles.chartWrapper}>
//       <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
//         This Week's Visitors by Day
//       </Text>
//       {renderBarChart(chartData.weeklyData, chartData.weeklyLabels || [])}
//     </View>
//   )}

//   {selectedPeriod === "month" && (
//     <View style={styles.chartWrapper}>
//       <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
//         This Month's Visitors by Day
//       </Text>
//       {renderBarChart(
//         chartData.monthlyData.filter((_, i) => i < new Date().getDate()), 
//         Array.from({length: new Date().getDate()}, (_, i) => (i + 1).toString())
//       )}
//     </View>
//   )}

//   {selectedPeriod === "year" && (
//     <View style={styles.chartWrapper}>
//       <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
//         Visitors by Category
//       </Text>
//       {renderCategoryChart(chartData.categoryData)}
//     </View>
//   )}
// </View>
//         {/* Complaint Container */}
//         <View
//           style={[
//             styles.complaintsContainer,
//             {
//               backgroundColor: colors.surface,
//               shadowColor: colors.textPrimary,
//             },
//           ]}
//         >
//           {/* Header with Title and See All Button */}
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
//               Recent Complaints
//             </Text>

//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/(tabs)/Complaints/Complaints",
//                   params: {
//                     presentation: "card",
//                     animation: "slide_from_right",
//                   },
//                 })
//               }
//             >
//               <Text style={[styles.seeAllText, { color: colors.primary }]}>
//                 See All
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Quick Stats */}
//           <View style={styles.complaintStats}>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: colors.warning }]}>
//                 {pendingComplaints.length}
//               </Text>
//               <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//                 Pending
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: colors.success }]}>
//                 {resolvedComplaints.length}
//               </Text>
//               <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//                 Resolved
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: colors.primary }]}>
//                 {pendingComplaints.length + resolvedComplaints.length}
//               </Text>
//               <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//                 Total
//               </Text>
//             </View>
//           </View>

//           {/* Complaints List */}
//           {loading ? (
//             <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
//               Loading complaints...
//             </Text>
//           ) : error ? (
//             <Text style={[styles.errorText, { color: colors.error }]}>
//               {error}
//             </Text>
//           ) : recentComplaints.length === 0 ? (
//             <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
//               No pending complaints
//             </Text>
//           ) : (
//             recentComplaints.map((complaint) => (
//               <View
//                 key={complaint.complaint_id}
//                 style={[
//                   styles.complaintCard,
//                   { borderBottomColor: colors.border },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.complaintPerson,
//                     { color: colors.textPrimary },
//                   ]}
//                 >
//                   👤 {complaint.complainer_name}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.complaintText,
//                     { color: colors.textSecondary },
//                   ]}
//                 >
//                   {complaint.complaint_reason}
//                 </Text>
//                 <Text
//                   style={[styles.complaintMeta, { color: colors.textTertiary }]}
//                 >
//                   {complaint.complainer_city} •{" "}
//                   {formatDate(complaint.created_at)}
//                 </Text>
//               </View>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   periodSelector: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 16,
//     paddingHorizontal: 16,
//   },
//   periodButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginHorizontal: 4,
//     borderRadius: 20,
//     minWidth: 60,
//     alignItems: "center",
//   },
//   periodButtonActive: {},
//   periodButtonText: {
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   periodButtonTextActive: {},
//   summaryContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     paddingHorizontal: 16,
//     // marginBottom: 8,
//   },
//   summaryCard: {
//     borderRadius: 12,
//     padding: 16,
//     width: "48%",
//     alignItems: "center",
//     marginBottom: 12,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   summaryNumber: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     textAlign: "center",
//   },
//   chartsContainer: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderRadius: 12,
//     padding: 16,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   chartWrapper: {
//     alignItems: "center",
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 16,
//     alignSelf: "center",
//   },
//   chartContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     height: 200,
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   barContainer: {
//     alignItems: "center",
//     justifyContent: "flex-end",
//     flex: 1,
//     height: "100%",
//   },
//   barLabelContainer: {
//     marginBottom: 5,
//   },
//   barLabel: {
//     fontSize: 12,
//   },
//   barBackground: {
//     width: 20,
//     height: "80%",
//     borderRadius: 10,
//     overflow: "hidden",
//     justifyContent: "flex-end",
//   },
//   bar: {
//     width: 20,
//     borderRadius: 10,
//   },
//   barValue: {
//     marginTop: 5,
//     fontSize: 12,
//   },
//   categoryContainer: {
//     width: "100%",
//   },
//   categoryItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   colorBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   categoryText: {
//     fontSize: 14,
//   },
//   recentContainer: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderRadius: 12,
//     padding: 16,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   visitorCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   visitorInfo: {
//     flex: 1,
//   },
//   visitorName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   visitorCompany: {
//     fontSize: 14,
//   },
//   visitorDetails: {
//     alignItems: "flex-end",
//   },
//   visitorTime: {
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   purposeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   purposeText: {
//     fontSize: 12,
//     color: "#ffffff",
//     fontWeight: "500",
//   },

//   //compaints styling
//   complaintsContainer: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderRadius: 12,
//     padding: 16,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   complaintCard: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   complaintPerson: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   complaintText: {
//     fontSize: 14,
//   },

//   //recent complaints styilng
//   seeAllText: {
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   loadingText: {
//     textAlign: "center",
//     padding: 20,
//     fontSize: 14,
//   },
//   complaintStats: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   statItem: {
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   statLabel: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   errorText: {
//     textAlign: "center",
//     padding: 20,
//     fontSize: 14,
//   },
//   noDataText: {
//     textAlign: "center",
//     padding: 20,
//     fontSize: 14,
//     fontStyle: "italic",
//   },
//   complaintMeta: {
//     fontSize: 12,
//     fontStyle: "italic",
//   },

//   //data
//   noDataContainer: {
//   alignItems: 'center',
//   justifyContent: 'center',
//   height: 100,
// },
// categoryTextContainer: {
//   flex: 1,
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// },
// categoryName: {
//   fontSize: 14,
//   flex: 1,
// },
// categoryCount: {
//   fontSize: 12,
// },
// });

// export default VisitorLogDashboard;




//updated code
import { useTheme } from "@/src/constants/theme";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/src/context/AuthContext";
import { getAllComplaints } from "@/src/api/complaints/getAllComplaints";
import { visitorService, Visitor, DashboardStats } from "@/src/api/Home/HomeCount";

interface Complaint {
  complaint_id: number;
  dept_id: number;
  complainer_name: string;
  complainer_mobile: string;
  complainer_city: string;
  complaint_reason: string;
  status: "pending" | "resolved";
  resolved_by: number | null;
  resolved_at: string | null;
  created_at: string;
}

const VisitorLogDashboard = () => {
  const { theme, colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">("today");
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    todayData: [],
    weekData: [],
    monthData: [],
    yearData: []
  });

 const [chartData, setChartData] = useState({
  weeklyData: [0, 0, 0, 0, 0, 0, 0],
  weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
  monthlyData: Array(31).fill(0),
  yearlyData: Array(12).fill(0), // Add this line
  dailyData: Array(15).fill(0),
  dailyLabels: Array.from({length: 15}, (_, i) => {
    const hour = 6 + i;
    return hour <= 12 ? `${hour}AM` : `${hour - 12}PM`;
  }),
  categoryData: [
    { name: "Delivery", count: 0, color: colors.error },
    { name: "Meeting", count: 0, color: colors.accent },
    { name: "Interview", count: 0, color: colors.warning },
    { name: "Maintenance", count: 0, color: colors.info || colors.primary },
    { name: "Personal", count: 0, color: colors.primary },
    { name: "Casual", count: 0, color: colors.secondary },
    { name: "Other", count: 0, color: colors.textTertiary || colors.textSecondary },
  ],
});

  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [resolvedComplaints, setResolvedComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuth();

  
const processVisitorData = (visitors: Visitor[], period: string) => {
  const hourlyData = Array(24).fill(0);
  const weeklyData = Array(7).fill(0);
  const monthlyData = Array(31).fill(0);
  const yearlyData = Array(12).fill(0);

  const categoryCounts: { [key: string]: number } = {
    "Delivery": 0,
    "Meeting": 0,
    "Interview": 0,
    "Maintenance": 0,
    "Personal": 0,
    "Casual": 0,
    "Other": 0
  };

  visitors.forEach(visitor => {
    const reason = visitor.reason.toLowerCase();
    if (reason.includes('delivery')) categoryCounts["Delivery"]++;
    else if (reason.includes('meeting')) categoryCounts["Meeting"]++;
    else if (reason.includes('interview')) categoryCounts["Interview"]++;
    else if (reason.includes('maintenance')) categoryCounts["Maintenance"]++;
    else if (reason.includes('personal')) categoryCounts["Personal"]++;
    else if (reason.includes('casual')) categoryCounts["Casual"]++;
    else categoryCounts["Other"]++;

    if (visitor.created_at) {
      const createdTime = new Date(visitor.created_at);
      
      // Hourly data
      const hour = createdTime.getHours();
      hourlyData[hour]++;
      
      // Weekly data - getDay() returns 0 (Sunday) to 6 (Saturday)
      const dayOfWeek = createdTime.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      weeklyData[dayOfWeek]++;
      
      // Monthly data
      const dayOfMonth = createdTime.getDate();
      if (dayOfMonth >= 1 && dayOfMonth <= 31) {
        monthlyData[dayOfMonth - 1]++;
      }
      
      // Yearly data
      const month = createdTime.getMonth();
      if (month >= 0 && month <= 11) {
        yearlyData[month]++;
      }
    }
  });

  // For daily chart (6AM to 8PM)
  const startHour = 6;
  const endHour = 20;
  const relevantDailyData = hourlyData.slice(startHour, endHour + 1);
  const dailyLabels = Array.from({length: endHour - startHour + 1}, (_, i) => {
    const hour = startHour + i;
    return hour <= 12 ? `${hour}AM` : `${hour - 12}PM`;
  });

  // FIX: For weekly chart - reorder to start from Sunday (0) to Saturday (6)
  // JavaScript getDay(): 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
 // For weekly chart - Monday first, Sunday last
const reorderedWeeklyData = [...weeklyData.slice(1), weeklyData[0]]; // Move Sunday to end
const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Alternative: If you want Monday first, include Sunday at the end
  // const reorderedWeeklyData = [...weeklyData.slice(1), weeklyData[0]]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  // const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  setChartData(prev => ({
    ...prev,
    dailyData: relevantDailyData,
    dailyLabels: dailyLabels,
    weeklyData: reorderedWeeklyData,
    weeklyLabels: weeklyLabels,
    monthlyData: monthlyData,
    yearlyData: yearlyData,
    categoryData: [
      { name: "Delivery", count: categoryCounts["Delivery"], color: colors.error },
      { name: "Meeting", count: categoryCounts["Meeting"], color: colors.accent },
      { name: "Interview", count: categoryCounts["Interview"], color: colors.warning },
      { name: "Maintenance", count: categoryCounts["Maintenance"], color: colors.info || colors.primary },
      { name: "Personal", count: categoryCounts["Personal"], color: colors.primary },
      { name: "Casual", count: categoryCounts["Casual"], color: colors.secondary },
      { name: "Other", count: categoryCounts["Other"], color: colors.textTertiary || colors.textSecondary },
    ].filter(item => item.count > 0)
  }));

  console.log('Weekly data processed:', reorderedWeeklyData);
  console.log('Weekly labels:', weeklyLabels);
};

  // Render bar chart function with dynamic labels
 // Fix the function signature - remove the formatting parameter for now
const renderBarChart = (data: number[], labels: string[], maxBars: number = 31) => {
  // Add safety check at the beginning
  if (!data || !labels) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          Data not available
        </Text>
      </View>
    );
  }

  if (data.length === 0 || data.every(val => val === 0)) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          No data available for this period
        </Text>
      </View>
    );
  }

  const maxValue = Math.max(...data, 1);
  const displayData = data.slice(0, maxBars);
  const displayLabels = labels.slice(0, maxBars);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View style={[styles.chartContainer, { width: displayData.length * 40 }]}>
        {displayData.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barLabelContainer}>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                {displayLabels[index]}
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
                    backgroundColor: value > 0 ? colors.primary : colors.border,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: colors.textPrimary }]}>
              {value > 0 ? value : ''}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
  // Enhanced category chart with percentages
  const renderCategoryChart = (data: typeof chartData.categoryData) => {
    if (data.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
            No category data available
          </Text>
        </View>
      );
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
      <View style={styles.categoryContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <View style={styles.categoryTextContainer}>
              <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                {item.name}
              </Text>
              <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                {item.count} ({Math.round((item.count / total) * 100)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Fetch all data including visitor stats and complaints
 const fetchAllData = async () => {
  if (!token) {
    setError("No authentication token available");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const [dashboardStats, pendingData, resolvedData] = await Promise.all([
      visitorService.getDashboardCounts(token),
      getAllComplaints(token, "pending"),
      getAllComplaints(token, "resolved"),
    ]);

    console.log('API Response - Monthly data:', dashboardStats.monthData);
    console.log('Monthly count:', dashboardStats.month);
    console.log('Monthly visitors:', dashboardStats.monthData.length);

    setStats(dashboardStats);
    setPendingComplaints(pendingData || []);
    setResolvedComplaints(resolvedData || []);

   const currentData = getCurrentPeriodData(selectedPeriod, dashboardStats);
processVisitorData(currentData || [], selectedPeriod); // Add fallback for currentData

  } catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to load dashboard data");
  } finally {
    setLoading(false);
  }
};

  // Get data for current period
  const getCurrentPeriodData = (period: string, statsData: DashboardStats): Visitor[] => {
    switch (period) {
      case "today": return statsData.todayData;
      case "week": return statsData.weekData;
      case "month": return statsData.monthData;
      case "year": return statsData.yearData;
      default: return [];
    }
  };

  // Handle period change
  // Handle period change
const handlePeriodChange = (period: "today" | "week" | "month" | "year") => {
  setSelectedPeriod(period);
  const currentData = getCurrentPeriodData(period, stats);
  processVisitorData(currentData, period); // Pass period parameter
};

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get recent complaints (last 3 pending complaints)
  const recentComplaints = pendingComplaints.slice(0, 3);

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
  {/* Today Card */}
  <TouchableOpacity
    style={styles.touchableCard} // Add this style for proper spacing
    onPress={() =>
      router.push({
        pathname: "/(tabs)/home/DashCount",
        params: { 
          period: "today", 
          count: stats.today,
          data: JSON.stringify(stats.todayData)
        },
      })
    }
  >
    <View style={[
      styles.summaryCard,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.textPrimary,
      },
    ]}>
      <Text style={[styles.summaryNumber, { color: colors.primary }]}>
        {stats.today}
      </Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
        Today
      </Text>
    </View>
  </TouchableOpacity>

  {/* Week Card */}
  <TouchableOpacity
    style={styles.touchableCard}
    onPress={() =>
      router.push({
        pathname: "/(tabs)/home/DashCount",
        params: { 
          period: "week", 
          count: stats.week,
          data: JSON.stringify(stats.weekData)
        },
      })
    }
  >
    <View style={[
      styles.summaryCard,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.textPrimary,
      },
    ]}>
      <Text style={[styles.summaryNumber, { color: colors.primary }]}>
        {stats.week}
      </Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
        This Week
      </Text>
    </View>
  </TouchableOpacity>

  {/* Month Card */}
  <TouchableOpacity
    style={styles.touchableCard}
    onPress={() =>
      router.push({
        pathname: "/(tabs)/home/DashCount",
        params: { 
          period: "month", 
          count: stats.month,
          data: JSON.stringify(stats.monthData)
        },
      })
    }
  >
    <View style={[
      styles.summaryCard,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.textPrimary,
      },
    ]}>
      <Text style={[styles.summaryNumber, { color: colors.primary }]}>
        {stats.month}
      </Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
        This Month
      </Text>
    </View>
  </TouchableOpacity>

  {/* Year Card */}
  <TouchableOpacity
    style={styles.touchableCard}
    onPress={() =>
      router.push({
        pathname: "/(tabs)/home/DashCount",
        params: { 
          period: "year", 
          count: stats.year,
          data: JSON.stringify(stats.yearData)
        },
      })
    }
  >
    <View style={[
      styles.summaryCard,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.textPrimary,
      },
    ]}>
      <Text style={[styles.summaryNumber, { color: colors.primary }]}>
        {stats.year}
      </Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
        This Year
      </Text>
    </View>
  </TouchableOpacity>
</View>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(["today", "week", "month", "year"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    theme === "light" ? LightColors.border : DarkColors.border,
                },
                selectedPeriod === period && [
                  styles.periodButtonActive,
                  { backgroundColor: colors.primary },
                ],
              ]}
              onPress={() => handlePeriodChange(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  { color: colors.textSecondary },
                  selectedPeriod === period && [
                    styles.periodButtonTextActive,
                    { color: colors.surface },
                  ],
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
              <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
                Today's Visitors by Hour (Based on Log Time)
              </Text>
              {renderBarChart(chartData.dailyData, chartData.dailyLabels || [])}
            </View>
          )}

         {selectedPeriod === "week" && (
  <View style={styles.chartWrapper}>
    <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
      This Week's Visitors by Day
    </Text>
    {renderBarChart(chartData.weeklyData, chartData.weeklyLabels || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 7)}
  </View>
)}

          {selectedPeriod === "month" && (
  <View style={styles.chartWrapper}>
    <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
      This Month's Visitors by Day
    </Text>
    {renderBarChart(
      chartData.monthlyData, 
      Array.from({length: 31}, (_, i) => (i + 1).toString()),
      31 // Show all 31 days
    )}
  </View>
)}

        {selectedPeriod === "year" && (
  <View style={styles.chartWrapper}>
    <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
      This Year's Visitors by Month
    </Text>
    {renderBarChart(
      chartData.yearlyData || Array(12).fill(0), // Add fallback
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      12
    )}
  </View>
)}
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
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Complaints
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/Complaints/Complaints",
                  params: {
                    presentation: "card",
                    animation: "slide_from_right",
                  },
                })
              }
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.complaintStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {pendingComplaints.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Pending
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {resolvedComplaints.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Resolved
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {pendingComplaints.length + resolvedComplaints.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total
              </Text>
            </View>
          </View>

          {loading ? (
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading complaints...
            </Text>
          ) : error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          ) : recentComplaints.length === 0 ? (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
              No pending complaints
            </Text>
          ) : (
            recentComplaints.map((complaint) => (
              <View
                key={complaint.complaint_id}
                style={[
                  styles.complaintCard,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.complaintPerson,
                    { color: colors.textPrimary },
                  ]}
                >
                  👤 {complaint.complainer_name}
                </Text>
                <Text
                  style={[
                    styles.complaintText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {complaint.complaint_reason}
                </Text>
                <Text
                  style={[styles.complaintMeta, { color: colors.textTertiary }]}
                >
                  {complaint.complainer_city} • {formatDate(complaint.created_at)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
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
  },
  touchableCard: { // Add this new style
    width: "48%",
    marginBottom: 12,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    width: "100%", // Change from 48% to 100% since touchableCard handles width
    alignItems: "center",
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
  // ... rest of your styles remain the same
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
    minWidth: '100%',
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
  categoryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
  },
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
  seeAllText: {
    fontWeight: "600",
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },
  complaintStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    fontStyle: "italic",
  },
  complaintMeta: {
    fontSize: 12,
    fontStyle: "italic",
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
});

export default VisitorLogDashboard;