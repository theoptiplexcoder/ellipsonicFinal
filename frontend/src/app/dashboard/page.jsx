"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUserFromToken, getToken, getAuthHeaders } from "@/lib/auth";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // State for create event form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }

      const userData = getUserFromToken();
      if (!userData) {
        router.push("/sign-in");
        return;
      }

      setUser(userData);
      await fetchEvents();
    };

    checkAuth();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/v1/events/view-all-events",
        {
          headers: getAuthHeaders(),
        }
      );
      setEvents(response.data.events || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) {
      setError("Title and date are required");
      return;
    }

    try {
      setIsCreating(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/events/create-event",
        {
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          createdBy: user.userId
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setEvents([response.data.event, ...events]);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        capacity: "",
      });
      setError("");
      alert("Event created successfully!");
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/events/delete-event/${eventId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError("Failed to delete event");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ADMIN VIEW - Create Events
  if (user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Event Management</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}. Create and manage events.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Create Event Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Title *
                  </label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <Input
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Capacity
                    </label>
                    <Input
                      type="number"
                      name="capacity"
                      placeholder="Enter max attendees (optional)"
                      value={formData.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Date *
                  </label>
                  <Input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Your Events List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
            {events.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No events created yet. Create your first event above!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onDelete={handleDeleteEvent}
                    action="view"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // REGULAR USER VIEW - View Events
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
          <p className="text-muted-foreground">
            Browse and explore upcoming events.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No events available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                action="view"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
