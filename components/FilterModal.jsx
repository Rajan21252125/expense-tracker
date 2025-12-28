import { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { THEMES } from "../constants/Colors.js";
import { useTheme } from "../context/ThemeContext";


export default function FilterModal({ visible, onClose, filters, setFilters }) {
  const [local, setLocal] = useState(filters);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const { theme, themeName, changeTheme } = useTheme();

  const getCurrentMonthRange = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      from: first.toISOString().split("T")[0],
      to: last.toISOString().split("T")[0],
    };
  };

  const applyFilters = () => {
    setFilters(local);
    onClose();
  };

  const resetFilters = () => {
    const current = getCurrentMonthRange();
    setLocal({
      type: "all",
      category: "All",
      month: "current",
      ...current,
    });
  };

  const chipStyle = (active) => ({
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: active ? theme.primary : theme.border,
  });

  const chipText = (active) => ({
    color: active ? theme.white : theme.text,
    fontWeight: "500",
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: theme.card,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {/* HEADER */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.text }}>
              Filters
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 16, color: theme.text }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* THEME SELECTOR */}
          <Text style={{ marginTop: 20, fontWeight: "600", color: theme.text }}>
            Theme
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {Object.keys(THEMES).map((t) => {
              const active = themeName === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => changeTheme(t)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor: active ? theme.primary : theme.border,
                  }}
                >
                  <Text style={{ color: active ? theme.white : theme.text }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>


          {/* TYPE FILTER */}
          <Text style={{ marginTop: 15, fontWeight: "600", color: theme.text }}>
            Type
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            {["all", "income", "expense"].map((t) => {
              const active = local.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setLocal({ ...local, type: t })}
                  style={chipStyle(active)}
                >
                  <Text style={chipText(active)}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CATEGORY FILTER */}
          <Text style={{ marginTop: 15, fontWeight: "600", color: theme.text }}>
            Category
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {["All", "Food", "Bills", "Travel", "Shopping", "Other"].map((c) => {
              const active = local.category === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setLocal({ ...local, category: c })}
                  style={chipStyle(active)}
                >
                  <Text style={chipText(active)}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* MONTH FILTER */}
          <Text style={{ marginTop: 15, fontWeight: "600", color: theme.text }}>
            Month
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                const r = getCurrentMonthRange();
                setLocal({ ...local, month: "current", ...r });
              }}
              style={chipStyle(local.month === "current")}
            >
              <Text style={chipText(local.month === "current")}>This Month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const now = new Date();
                const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const last = new Date(now.getFullYear(), now.getMonth(), 0);

                setLocal({
                  ...local,
                  month: "previous",
                  from: first.toISOString().split("T")[0],
                  to: last.toISOString().split("T")[0],
                });
              }}
              style={chipStyle(local.month === "previous")}
            >
              <Text style={chipText(local.month === "previous")}>Last Month</Text>
            </TouchableOpacity>
          </View>

          {/* DATE RANGE */}
          <Text style={{ marginTop: 15, fontWeight: "600", color: theme.text }}>
            Date Range
          </Text>

          <TouchableOpacity
            onPress={() => setShowFromPicker(true)}
            style={{
              padding: 10,
              backgroundColor: theme.border,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text style={{ color: theme.text }}>From: {local.from}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowToPicker(true)}
            style={{
              padding: 10,
              backgroundColor: theme.border,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text style={{ color: theme.text }}>To: {local.to}</Text>
          </TouchableOpacity>

          {/* DATE PICKERS */}
          {showFromPicker && (
            <DateTimePicker
              value={new Date(local.from)}
              mode="date"
              maximumDate={new Date()} // restrict future
              onChange={(e, date) => {
                setShowFromPicker(false);
                if (date) {
                  if (date > new Date(local.to)) {
                    alert("Start date cannot be after end date.");
                    return;
                  }
                  setLocal({ ...local, from: date.toISOString().split("T")[0] });
                }
              }}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={new Date(local.to)}
              mode="date"
              maximumDate={new Date()} // restrict future
              onChange={(e, date) => {
                setShowToPicker(false);
                if (date) {
                  if (date < new Date(local.from)) {
                    alert("End date cannot be before start date.");
                    return;
                  }
                  setLocal({ ...local, to: date.toISOString().split("T")[0] });
                }
              }}
            />
          )}

          {/* BUTTONS */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={applyFilters}
              style={{
                padding: 12,
                backgroundColor: theme.primary,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: theme.white, fontWeight: "600" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
