"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus, MoreHorizontal, Mail, Shield, User as UserIcon } from "lucide-react";
import { adminGetUsers, User } from "@/services/accounts";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminGetUsers,
  });

  const users = (data as any)?.results ?? data ?? [];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.02em",
              marginBottom: 3,
            }}
          >
            User Management
          </h1>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>
            Manage all system users and their permissions.
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "#1D4ED8",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          padding: "20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
          System Users
        </div>
        <div style={{ position: "relative", width: 280 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: 8,
              border: "0.5px solid #E5E7EB",
              fontSize: 13.5,
              outline: "none",
              color: "#111827",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "0.5px solid #E5E7EB" }}>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>User</th>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</th>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Provider</th>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Joined</th>
              <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: User, idx: number) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: idx === filteredUsers.length - 1 ? "none" : "0.5px solid #F3F4F6",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#EFF6FF", border: "0.5px solid #BFDBFE",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden"
                      }}>
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <UserIcon size={18} color="#1D4ED8" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={10} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 8px", borderRadius: 6,
                      background: user.is_staff ? "#FFFBEB" : "#ECFDF5",
                      color: user.is_staff ? "#B45309" : "#065F46",
                      fontSize: 11, fontWeight: 600, textTransform: "uppercase"
                    }}>
                      {user.is_staff && <Shield size={10} />}
                      {user.is_staff ? "Admin" : "Client"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, color: "#4B5563", textTransform: "capitalize" }}>
                      {user.auth_provider}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button style={{
                      padding: "5px", borderRadius: 6, border: "0.5px solid #E5E7EB",
                      background: "#fff", cursor: "pointer", color: "#6B7280"
                    }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
