"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Database,
  BarChart3,
  Users,
  FileText,
  Settings,
  Search,
  Brain,
  Microscope,
  FlaskConical,
  TrendingUp
} from 'lucide-react'

interface TableData {
  [key: string]: any
}

interface TableInfo {
  table_name: string
  column_count: number
}

const AdminDashboard = () => {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<TableData[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [editingRow, setEditingRow] = useState<TableData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalTables: 0,
    totalRecords: 0,
    activeSubscribers: 0,
    totalDownloads: 0
  })

  // Fetch available tables and stats
  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_name', 'migrations')

      if (error) {
        // Fallback to known tables if information_schema doesn't work
        const knownTables = ['lead_magnets', 'subscribers', 'downloads', 'email_campaigns', 'campaign_sends']
        setTables(knownTables.map(name => ({ table_name: name, column_count: 0 })))
      } else {
        const tablesWithCount = (data || []).map(table => ({
          ...table,
          column_count: 0
        }))
        setTables(tablesWithCount)
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
      // Use hardcoded table list as fallback
      setTables([
        { table_name: 'lead_magnets', column_count: 7 },
        { table_name: 'subscribers', column_count: 6 },
        { table_name: 'downloads', column_count: 5 },
        { table_name: 'email_campaigns', column_count: 8 },
        { table_name: 'campaign_sends', column_count: 6 }
      ])
    } finally {
      setLoading(false)
      // Fetch stats after tables are loaded
      fetchStats()
    }
  }

  const fetchStats = async () => {
    try {
      // Count total tables
      const totalTables = tables.length

      // Count subscribers
      const { count: subscribersCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })

      // Count active subscribers
      const { count: activeCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('email_verified', true)

      // Count downloads
      const { count: downloadsCount } = await supabase
        .from('downloads')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalTables: tables.length,
        totalRecords: subscribersCount || 0,
        activeSubscribers: activeCount || 0,
        totalDownloads: downloadsCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)

      if (error) {
        toast({
          title: "エラー",
          description: `テーブル ${tableName} の取得に失敗しました: ${error.message}`,
          variant: "destructive"
        })
        return
      }

      setTableData(data || [])
      if (data && data.length > 0) {
        setColumns(Object.keys(data[0]))
      }
    } catch (error) {
      console.error('Error fetching table data:', error)
      toast({
        title: "エラー",
        description: "データの取得中にエラーが発生しました",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)
    fetchTableData(tableName)
  }

  const handleEdit = (row: TableData) => {
    setEditingRow(row)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingRow || !selectedTable) return

    try {
      const { error } = await supabase
        .from(selectedTable)
        .update(editingRow)
        .eq('id', editingRow.id)

      if (error) {
        toast({
          title: "エラー",
          description: `更新に失敗しました: ${error.message}`,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "成功",
        description: "データが正常に更新されました"
      })

      setIsDialogOpen(false)
      setEditingRow(null)
      fetchTableData(selectedTable)
    } catch (error) {
      console.error('Error updating data:', error)
      toast({
        title: "エラー",
        description: "更新中にエラーが発生しました",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!selectedTable || !confirm('本当に削除しますか？')) return

    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', id)

      if (error) {
        toast({
          title: "エラー",
          description: `削除に失敗しました: ${error.message}`,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "成功",
        description: "データが正常に削除されました"
      })

      fetchTableData(selectedTable)
    } catch (error) {
      console.error('Error deleting data:', error)
      toast({
        title: "エラー",
        description: "削除中にエラーが発生しました",
        variant: "destructive"
      })
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                AI在宅ワーク研究所
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                研究データ管理システム
              </p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-200" />
                  <div>
                    <p className="text-blue-100 text-sm font-medium">研究テーブル</p>
                    <p className="text-2xl font-bold">{stats.totalTables}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-indigo-200" />
                  <div>
                    <p className="text-blue-100 text-sm font-medium">研究員</p>
                    <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-200" />
                  <div>
                    <p className="text-blue-100 text-sm font-medium">総レコード</p>
                    <p className="text-2xl font-bold">{stats.totalRecords}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-200" />
                  <div>
                    <p className="text-blue-100 text-sm font-medium">ダウンロード</p>
                    <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 -mt-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-gray-800">研究データテーブル</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchTables}
                    disabled={loading}
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <RefreshCw className={`h-4 w-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <CardDescription className="text-gray-600">
                  研究データの構造を探索
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tables.map((table) => (
                  <Button
                    key={table.table_name}
                    variant={selectedTable === table.table_name ? "default" : "outline"}
                    className={`w-full justify-start transition-all duration-200 ${
                      selectedTable === table.table_name 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]" 
                        : "bg-white/50 hover:bg-white/80 border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                    onClick={() => handleTableSelect(table.table_name)}
                  >
                    <FlaskConical className="h-4 w-4 mr-2" />
                    <span className="font-medium">{table.table_name}</span>
                    {table.column_count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-auto text-xs ${
                          selectedTable === table.table_name 
                            ? "bg-white/20 text-white" 
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {table.column_count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Table Data */}
          <div className="lg:col-span-3">
            {selectedTable ? (
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader className="border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800 font-bold">
                          {selectedTable}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          研究データセット - {tableData.length} 件のレコード
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchTableData(selectedTable)}
                        disabled={loading}
                        className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                        更新
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping"></div>
                        <RefreshCw className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
                      </div>
                      <p className="text-lg font-medium">研究データを分析中...</p>
                      <p className="text-sm text-gray-400 mt-1">データの取得には少し時間がかかる場合があります</p>
                    </div>
                  ) : tableData.length > 0 ? (
                    <div className="overflow-auto max-h-[500px] rounded-lg border border-gray-200/50">
                      <Table>
                        <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                          <TableRow className="border-b border-gray-200/50">
                            {columns.map((column) => (
                              <TableHead key={column} className="whitespace-nowrap font-bold text-gray-700 p-4">
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4 text-blue-600" />
                                  {column}
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="w-32 font-bold text-gray-700 p-4">
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-blue-600" />
                                操作
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, index) => (
                            <TableRow 
                              key={row.id || index}
                              className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
                            >
                              {columns.map((column) => (
                                <TableCell key={column} className="max-w-48 truncate p-4 text-gray-700">
                                  <div className="font-medium">
                                    {formatValue(row[column])}
                                  </div>
                                </TableCell>
                              ))}
                              <TableCell className="p-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(row)}
                                    className="bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(row.id)}
                                    className="bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50"></div>
                        <div className="relative bg-gray-100 rounded-full p-6 mx-auto w-fit">
                          <Search className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        研究データが見つかりません
                      </h3>
                      <p className="text-gray-500">
                        このテーブルにはまだデータが登録されていません
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-8 mx-auto w-fit">
                      <Microscope className="h-16 w-16 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    研究データテーブルを選択
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    左側のリストから研究データテーブルを選択すると、詳細なデータセットの分析を開始できます
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <FlaskConical className="h-4 w-4" />
                    <span>AI在宅ワーク研究所データベース</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border-white/20">
          <DialogHeader className="border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  研究データ編集
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTable} テーブルのレコードを編集
                </p>
              </div>
            </div>
          </DialogHeader>
          {editingRow && (
            <div className="space-y-6 mt-6">
              {Object.entries(editingRow).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label 
                    htmlFor={key} 
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    {key}
                  </Label>
                  <div>
                    {key === 'id' ? (
                      <Input
                        id={key}
                        value={formatValue(value)}
                        disabled
                        className="bg-gray-50 border-gray-200 text-gray-500"
                      />
                    ) : typeof value === 'boolean' ? (
                      <Select
                        value={String(value)}
                        onValueChange={(newValue) =>
                          setEditingRow({ ...editingRow, [key]: newValue === 'true' })
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={key}
                        value={formatValue(value)}
                        onChange={(e) =>
                          setEditingRow({ ...editingRow, [key]: e.target.value })
                        }
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200/50">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  キャンセル
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <FlaskConical className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

export default AdminDashboard